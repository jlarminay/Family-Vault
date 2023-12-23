import { PrismaClient } from '@prisma/client';

import user from './user.js';
import video from './video.js';

const prisma = new PrismaClient();

async function main() {
  await user(prisma);
  await video(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
