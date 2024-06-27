import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
  async signIn(opts: { user: any; account: any; profile: any; email: any; credentials: any }) {
    const { user, account, profile, email, credentials } = opts;
    try {
      // check if user in db
      const userInDb = await prisma.user.findUniqueOrThrow({
        where: {
          email: user.email,
          provider: account.provider,
        },
      });

      // if yes, update user avatar and last login
      await prisma.user.update({
        where: {
          id: userInDb.id,
        },
        data: {
          avatar: user.image,
          lastLogin: new Date(),
        },
      });

      return true;
    } catch (e) {
      return '/login?state=error';
    }
  },
  async session(opts: { session: any; token: any; user: any }): Promise<any> {
    const { session } = opts;

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: session.user.email },
    });

    // return if user has any videos or if user is on any allow list
    const hasPrivateVideos = await prisma.video.count({
      where: {
        OR: [
          { AND: [{ ownerId: user.id }, { published: 'private' || 'allow-few' }] },
          { allowList: { some: { id: user.id } } },
        ],
      },
    });

    return {
      ...user,
      hasPrivateVideos: hasPrivateVideos > 0,
    };
  },
};
