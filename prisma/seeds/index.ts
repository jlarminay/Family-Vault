import { PrismaClient } from '@prisma/client';

import user from './user.js';
import video from './video.js';
import comment from './comment.js';
import person from './person.js';

const prisma = new PrismaClient();

async function main() {
  await user();
  await video();
  await comment();
  await person();
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
