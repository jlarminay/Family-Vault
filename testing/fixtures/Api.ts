import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';

exports.Api = class Api {
  connection: any;

  constructor() {
    let links = [
      httpBatchLink({
        url: process.env.TESTING_URL
          ? `${process.env.TESTING_URL}/trpc`
          : 'http://localhost:3000/trpc',
      }),
      loggerLink(),
    ];

    this.connection = createTRPCProxyClient<any>({
      links,
    });
  }

  // Events
  async updateEvent(newEventData: any) {
    try {
      const response = await this.connection.dev.editEvent.mutate({ id: 1, data: newEventData });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
};
