import { CampaignStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CampaignFilterDto {
  @IsOptional()
  @IsString()
  exactName?: string;

  @IsOptional()
  @IsString()
  partialName?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
