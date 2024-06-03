import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
  async signIn(opts: { user: any; account: any; profile: any; email: any; credentials: any }) {
    const { user, account, profile, email, credentials } = opts;
    try {
      // check if user in db
      // console.log('provider', account.provider);
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
      return false;
    }
  },
  async session(opts: { session: any; token: any; user: any }): Promise<any> {
    const { session } = opts;

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: session.user.email },
      include: {
        person: {
          select: {
            id: true,
            name: true,
            gender: true,
            image: true,
            birthday: true,
          },
        },
      },
    });

    return user;
  },
};
