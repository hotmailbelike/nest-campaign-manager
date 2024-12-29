import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { CampaignFilterDto } from './dto/filter-campaign.dto';

class PaginatedCampaignResponse {
  data: Campaign[];
  cursor: string | null;
  hasMore: boolean;
  totalCount: number;
}

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: createCampaignDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedCampaignResponse> {
    const { cursor, take } = query;

    // Fetch one extra item to determine if there are more items
    const campaigns = await this.prisma.campaign.findMany({
      ...(take && { take: parseInt(take) + 1 }),
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1, // Skip the cursor item
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Count of total items regardless of pagination
    const campaignCount = await this.prisma.campaign.count();

    // Check if we have more items
    const hasMore = campaigns.length > parseInt(take);
    // Remove the extra item if we fetched it
    const data = hasMore ? campaigns.slice(0, -1) : campaigns;

    return {
      data,
      cursor: hasMore ? campaigns[campaigns.length - 2].id : null,
      hasMore,
      totalCount: campaignCount,
    };
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
    const { exactName, partialName, status } = filters;

    const where: any = {};

    if (exactName) {
      where.name = exactName;
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
