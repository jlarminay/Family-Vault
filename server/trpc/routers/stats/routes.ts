import { protectedProcedure, router } from '@/server/trpc/trpc';
import dayjs from 'dayjs';

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({ include: { file: true } });

    const results = {
      items: {
        shortest: Infinity,
        longest: 0,
        average: 0,
        total: 0,
        views: 0,
        count: items.length,
      },
      format: {} as any,
      people: {} as any,
      year: {} as any,
    };

    items.forEach((item) => {
      const { file, dateOrder } = item;
      const metadata: any = file.metadata;
      const people = item.people?.split(',') || [];

      results.items.shortest = Math.min(results.items.shortest, metadata.duration);
      results.items.longest = Math.max(results.items.longest, metadata.duration);
      results.items.total += metadata.duration;
      results.items.views += item.view || 0;

      // people
      if (people.length > 0) {
        people.forEach((person: string) => {
          person = person.trim();
          if (person === '') return;
          if (!results.people[person]) {
            results.people[person] = { clips: 0, duration: 0 };
          }

          results.people[person].clips++;
          results.people[person].duration += metadata.duration / 60; // convert to minutes
        });
      }

      // sort date by year
      if (parseInt(dayjs(dateOrder).format('YYYY')) > 1900) {
        const year = dayjs(dateOrder).format('YYYY');
        if (!results.year[year]) {
          results.year[year] = { clips: 0, duration: 0 };
        }

        results.year[year].clips++;
        results.year[year].duration += metadata.duration / 60; // convert to minutes
      }

      // // original format
      // if (!!originalFormat) {
      //   if (!results.format[originalFormat]) {
      //     results.format[originalFormat] = { clips: 0, duration: 0 };
      //   }
      //   results.format[originalFormat].clips++;
      //   results.format[originalFormat].duration += metadata.duration / 60; // convert to minutes
      // }
    });

    // fill in missing years
    const firstYear = parseInt(Object.keys(results.year).sort((a, b) => (a > b ? 1 : -1))[0]) - 1;
    const lastYear = parseInt(Object.keys(results.year).sort((a, b) => (a > b ? -1 : 1))[0]) + 1;
    for (let i = firstYear; i <= lastYear; i++) {
      if (!results.year[i]) {
        results.year[i] = 0;
      }
    }

    // sort years
    results.year = Object.entries(results.year)
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .reduce((acc: any, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // make average
    results.items.average = results.items.total / items.length;

    return results;
  }),
});

// export type definition of API
export type StatsRouter = typeof statsRouter;
