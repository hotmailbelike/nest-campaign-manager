import { Prisma, PrismaClient } from '@prisma/client';
import { campaignData } from '../src/utils/campaign-data';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding the database...');

  // Seed Users
  await prisma.campaign.createMany({
    data: campaignData as Prisma.CampaignCreateManyInput[],
  });

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
