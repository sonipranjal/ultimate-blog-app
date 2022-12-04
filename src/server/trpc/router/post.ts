import slugify from "slugify";
import { z } from "zod";
import { postSchema } from "../../../pages";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(postSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { user } = session;

      await prisma.post.create({
        data: {
          title: input.title,
          slug: slugify(input.title),
          description: input.description,
          authorId: user.id,
          text: input.text,
          html: input.text,
          isPublished: false,
        },
      });
    }),
  getPosts: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }),
  getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input: { slug }, ctx: { prisma } }) => {
      const post = await prisma.post.findFirst({
        where: {
          slug,
        },
      });

      return post;
    }),
});
