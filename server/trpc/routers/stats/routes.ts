import { protectedProcedure, publicProcedure, router } from '@/server/trpc/trpc';
import dayjs from 'dayjs';

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // get all items
    const items = await ctx.prisma.item.findMany({
      include: {
        location: true,
      },
      orderBy: {
        takenAt: 'asc',
      },
    });

    // define results output
    const results = {
      views: 0,
      totalFileSize: 0,
      videos: {
        count: 0,
        totalLength: 0,
        averageLength: 0,
      },
      images: {
        count: 0,
      },
      people: {} as { [key: string]: number },
      year: {} as { [key: string]: { images: number; videos: number } },
      locations: [] as {
        id: number;
        name: string | null;
        city: string | null;
        country: string | null;
        lat: number;
        lng: number;
        count: number;
      }[],
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

    // calculate average video length
    results.videos.averageLength = Math.floor(results.videos.totalLength / results.videos.count);

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

    // sort locations by count
    const locations = await ctx.prisma.location.findMany({
      include: {
        _count: {
          select: {
            item: true,
          },
        },
      },
    });

    // update locations
    for (const location of locations) {
      // skip if no items
      if (location._count.item === 0) continue;
      // add location to results
      const cleaned = location.latLong.split(',');
      const lat = parseFloat(cleaned[0].trim());
      const lng = parseFloat(cleaned[1].trim());
      results.locations.push({
        id: location.id,
        name: location.name,
        city: location.city,
        country: location.country,
        lat: lat,
        lng: lng,
        count: location._count.item,
      });
    }

    return results;
  }),
  getPublic: publicProcedure.query(async ({ ctx }) => {
    // get all items
    const items = await ctx.prisma.item.findMany({
      include: {
        location: true,
      },
      orderBy: {
        takenAt: 'asc',
      },
    });

    // define results output
    const results = {
      views: 0,
      videos: 0,
      videosLength: 0,
      images: 0,
    };

    for (const item of items) {
      // update results
      results.views += item.view;

      // update videos and images count
      if (item.type === 'video') {
        results.videos += 1;
        results.videosLength += Math.floor((item.metadata as any)?.duration || 0);
      } else {
        results.images += 1;
      }
    }

    // round video count
    if (results.videos > 1000) {
      // round to closest 1000
      results.videos = Math.round(results.videos / 1000) * 1000;
    } else if (results.videos > 100) {
      // round to closest 100
      results.videos = Math.round(results.videos / 100) * 100;
    } else if (results.videos > 10) {
      // round to closest 10
      results.videos = Math.round(results.videos / 10) * 10;
    }

    // round image count
    if (results.images > 1000) {
      // round to closest 1000
      results.images = Math.round(results.images / 1000) * 1000;
    } else if (results.images > 100) {
      // round to closest 100
      results.images = Math.round(results.images / 100) * 100;
    } else if (results.images > 10) {
      // round to closest 10
      results.images = Math.round(results.images / 10) * 10;
    }

    // round views count
    if (results.views > 1000000) {
      // round to closest million
      results.views = Math.round(results.views / 1000000) * 1000000;
    } else if (results.views > 1000) {
      // round to closest thousand
      results.views = Math.round(results.views / 1000) * 1000;
    } else if (results.views > 100) {
      // round to closest hundred
      results.views = Math.round(results.views / 100) * 100;
    } else if (results.views > 10) {
      // round to closest ten
      results.views = Math.round(results.views / 10) * 10;
    }

    // round video length
    results.videosLength = 0.6 * 3600 + 200;
    if (results.videosLength > 3600) {
      // round to closest hour
      results.videosLength = Math.round(results.videosLength / 3600) * 3600;
    } else if (results.videosLength > 60) {
      // round to closest minute
      results.videosLength = Math.round(results.videosLength / 60) * 60;
    }

    return results;
  }),
});

// export type definition of API
export type StatsRouter = typeof statsRouter;
