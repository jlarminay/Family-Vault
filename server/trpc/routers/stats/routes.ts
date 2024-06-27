import { protectedProcedure, router } from '@/server/trpc/trpc';
import dayjs from 'dayjs';

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const videos = await ctx.prisma.video.findMany({ include: { video: true } });

    const results = {
      videos: {
        shortest: Infinity,
        longest: 0,
        average: 0,
        total: 0,
        views: 0,
        count: videos.length,
      },
      format: {} as any,
      people: {} as any,
      year: {} as any,
    };

    videos.forEach((video) => {
      const { video: videoData, dateOrder, originalFormat } = video;
      const metadata: any = videoData?.metadata;
      const people = video.people?.split(',') || [];

      results.videos.shortest = Math.min(results.videos.shortest, metadata.duration);
      results.videos.longest = Math.max(results.videos.longest, metadata.duration);
      results.videos.total += metadata.duration;
      results.videos.views += video.views || 0;

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

      // original format
      if (!!originalFormat) {
        if (!results.format[originalFormat]) {
          results.format[originalFormat] = { clips: 0, duration: 0 };
        }
        results.format[originalFormat].clips++;
        results.format[originalFormat].duration += metadata.duration / 60; // convert to minutes
      }
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
    results.videos.average = results.videos.total / videos.length;

    return results;
  }),
});

// export type definition of API
export type StatsRouter = typeof statsRouter;
