import { protectedProcedure, router } from '@/server/trpc/trpc';
import dayjs from 'dayjs';

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({
      orderBy: {
        takenAt: 'asc',
      },
    });

    const results = {
      views: 0,
      totalFileSize: 0,
      videos: {
        count: 0,
        totalLength: 0,
      },
      images: {
        count: 0,
      },
      people: {} as { [key: string]: number },
      year: {} as { [key: string]: { images: number; videos: number } },
    };

    for (const item of items) {
      // update results
      results.views += item.view;
      results.totalFileSize += parseInt(item.size);

      // update videos and images count
      if (item.type === 'video') {
        results.videos.count += 1;
        results.videos.totalLength += Math.floor((item.metadata as any)?.duration || 0);
      } else {
        results.images.count += 1;
      }

      // update people count
      if (item.people) {
        const people = item.people.split(',');
        for (let person of people) {
          person = person.trim();
          if (results.people[person]) {
            results.people[person] += 1;
          } else {
            results.people[person] = 1;
          }
        }
      }

      // update year count
      const year = dayjs(item.takenAt).format('YYYY');
      if (results.year[year]) {
        if (item.type === 'video') {
          results.year[year].videos += 1;
        } else {
          results.year[year].images += 1;
        }
      } else {
        results.year[year] = {
          images: item.type === 'image' ? 1 : 0,
          videos: item.type === 'video' ? 1 : 0,
        };
      }
    }

    // remove the year 1900
    delete results.year['1900'];

    // add year without images or videos
    const years = Object.keys(results.year).sort();
    const firstYear = parseInt(years[0]);
    const lastYear = parseInt(years[years.length - 1]);
    for (let year = firstYear; year <= lastYear; year++) {
      if (!results.year[year]) {
        results.year[year] = {
          images: 0,
          videos: 0,
        };
      }
    }

    return results;
  }),
});

// export type definition of API
export type StatsRouter = typeof statsRouter;
