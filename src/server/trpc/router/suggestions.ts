import { protectedProcedure, router } from "../trpc";

export const suggestionsRouter = router({
  getSuggestions: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      // get user likes and bookmarks -> extract tags -> find people who liked or bookmarked thaose tags posts

      const likes = await prisma.like.findMany({
        where: {
          userId: session.user.id,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          post: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      const interestedTags: string[] = [];

      likes.forEach((like) =>
        interestedTags.push(...like.post.tags.map((l) => l.name))
      );
      bookmarks.forEach((bookmark) =>
        interestedTags.push(...bookmark.post.tags.map((b) => b.name))
      );

      const suggestions = await prisma.user.findMany({
        where: {
          OR: [
            {
              likes: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              bookmarks: {
                some: {
                  post: {
                    tags: {
                      some: {
                        name: {
                          in: interestedTags,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          NOT: {
            id: session.user.id,
          },
        },
        select: {
          image: true,
          name: true,
          username: true,
          id: true,
        },
        take: 5,
      });

      return suggestions;
    }
  ),
});
