import { IsString, IsInt, IsEnum } from 'class-validator';
import { CampaignStatus } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  totalLeads: number;

  @IsInt()
  invites: number;

  @IsInt()
  connections: number;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;
}
