import { PrismaClient } from '@prisma/client';
import setting from './setting.js';
import user from './user.js';
import location from './location.js';
import item from './item.js';
import like from './like.js';
import comment from './comment.js';
import report from './report.js';

const prisma = new PrismaClient();

async function main() {
  await setting();
  await user();
  await location();
  await item();
  await like();
  await comment();
  await report();
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
