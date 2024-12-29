import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService],
  imports: [PrismaModule],
})
export class CampaignsModule {}
