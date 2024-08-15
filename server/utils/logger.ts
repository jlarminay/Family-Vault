import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
  writeToLog: async (opts: {
    ip: string;
    route: string;
    method: string;
    responseSize: number;
    requestBody: object;
    userId: number | null;
    userAgent: string;
  }) => {
    const { ip, route, method, responseSize, requestBody, userAgent, userId } = opts;

    await prisma.systemLog.create({
      data: {
        ip,
        route,
        method,
        responseSize,
        requestBody,
        userAgent,
        userId,
      },
    });
  },
};
