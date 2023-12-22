import { PrismaClient } from '@prisma/client';

import user from './user.js';

const prisma = new PrismaClient();

async function main() {
  await user(prisma);
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
