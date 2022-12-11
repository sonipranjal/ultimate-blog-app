import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { postSchema } from "../../../components/FormModal";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const postRouter = router({
  createPost: protectedProcedure
    .input(
      postSchema.and(
        z.object({
          tagIds: z.array(z.object({ id: z.string() })).optional(),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { user } = session;

      const existingPost = await prisma.post.findUnique({
        where: {
          title: input.title,
        },
      });

      if (existingPost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "post with this title already exists!",
        });
      }

      await prisma.post.create({
        data: {
          title: input.title,
          slug: slugify(input.title),
          description: input.description,
          authorId: user.id,
          text: input.text,
          html: input.text,
          isPublished: false,
          tags: {
            connect: input.tagIds,
          },
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
        tags: true,
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
  updatePost: protectedProcedure
    .input(
      postSchema
        .partial()
        .and(
          z
            .object({ isPublished: z.boolean(), featuredImage: z.string() })
            .partial()
        )
        .and(
          z.object({
            postId: z.string(),
          })
        )
    )
    .mutation(async ({ ctx: { prisma }, input: { postId, ...data } }) => {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          ...data,
        },
      });
    }),
});
