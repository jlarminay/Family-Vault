import { getServerSession } from '#auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (ctx) => {
  const request = ctx.node.req as any;
  const response = ctx.node.res as any;

  // get headers
  const apiToken = request.headers['x-api-token'];
  if (!apiToken) {
    response.statusCode = 401;
    response.end('Unauthorized');
    return;
  }

  // find user with token
  const user = await prisma.user.findFirst({
    where: {
      apiToken,
      active: true,
    },
  });

  // check if user exists
  if (!user) {
    response.statusCode = 401;
    response.end('Unauthorized');
    return;
  }

  // get all images
  const images = await prisma.item.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { published: 'public' },
        {
          AND: [{ published: 'allow-few' }, { allowList: { some: { id: user.id } } }],
        },
      ],
      type: 'image',
    },
    select: {
      id: true,
      name: true,
      path: true,
    },
  });

  console.log('images', images[0]);

  return {
    count: images.length,
    images,
  };
});
