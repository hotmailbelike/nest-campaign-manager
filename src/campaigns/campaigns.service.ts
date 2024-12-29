import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';

class PaginatedCampaignResponse {
  data: Campaign[];
  nextCursor: string | null;
  hasMore: boolean;
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
    const items = await this.prisma.campaign.findMany({
      take: take + 1,
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

    // Check if we have more items
    const hasMore = items.length > take;
    // Remove the extra item if we fetched it
    const data = hasMore ? items.slice(0, -1) : items;

    return {
      data,
      nextCursor: hasMore ? items[items.length - 2].id : null,
      hasMore,
    };
  }

  findOne(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
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
}
