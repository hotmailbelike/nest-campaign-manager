import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CampaignsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
