import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { CampaignFilterDto } from './dto/filter-campaign.dto';

class PaginatedCampaignResponse {
  data: Campaign[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
}

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: createCampaignDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedCampaignResponse> {
    const { cursor, direction = 'next', limit = 10 } = query;

    // Get items + 1 for pagination check
    const items = await this.prisma.campaign.findMany({
      take: direction === 'next' ? limit + 1 : -(limit + 1),
      ...(cursor && {
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.campaign.count();

    // Base case: no items found
    if (items.length === 0) {
      return {
        data: [],
        nextCursor: null,
        previousCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0,
      };
    }

    // Prepare items based on direction
    let finalItems = items;
    // if (direction === 'previous') {
    //   finalItems = items.reverse();
    // }

    // Remove extra item used for pagination check
    const hasMore = finalItems.length > limit;
    if (hasMore) {
      finalItems = finalItems.slice(0, limit);
    }

    // Determine pagination cursors and flags
    let result: PaginatedCampaignResponse;

    if (direction === 'next') {
      result = {
        data: finalItems,
        nextCursor: hasMore ? finalItems[finalItems.length - 1].id : null,
        previousCursor: cursor || null,
        hasNextPage: hasMore,
        hasPreviousPage: !!cursor,
        totalCount: count,
      };
    } else {
      result = {
        data: finalItems,
        nextCursor: cursor || null,
        previousCursor: hasMore ? finalItems[0].id : null,
        hasNextPage: !!cursor,
        hasPreviousPage: hasMore,
        totalCount: count,
      };
    }

    return result;
  }

  findOne(id: string) {
    return this.prisma.campaign.findUniqueOrThrow({ where: { id } });
  }

  update(id: string, updateCampaignDto: UpdateCampaignDto) {
    return this.prisma.campaign.update({
      where: { id },
      data: updateCampaignDto,
    });
  }

  remove(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }

  async getDistinctNames(): Promise<string[]> {
    const campaigns = await this.prisma.campaign.findMany({
      distinct: ['name'],
      select: {
        name: true,
      },
    });
    return campaigns.map((campaign) => campaign.name);
  }

  async findByFilters(filters: CampaignFilterDto): Promise<Campaign[]> {
    const { exactNames, partialName, status } = filters;

    const where: any = {};

    if (exactNames) {
      where.name = {
        in: exactNames.split(',').map((name) => name.trim()),
      };
    }

    if (partialName) {
      where.name = {
        contains: partialName,
        mode: 'insensitive', // This enables case-insensitive search
      };
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.campaign.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
