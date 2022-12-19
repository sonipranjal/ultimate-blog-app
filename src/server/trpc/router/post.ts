import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { postSchema } from "../../../components/FormModal";

import { protectedProcedure, publicProcedure, router } from "../trpc";

const LIMIT = 10;

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
  getPosts: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input: { userId, cursor } }) => {
      const { prisma } = ctx;

      const posts = await prisma.post.findMany({
        select: {
          title: true,
          description: true,
          slug: true,
          featuredImage: true,
          createdAt: true,
          tags: true,
          id: true,
          bookmarks: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
          author: {
            select: {
              name: true,
              image: true,
              username: true,
            },
          },
          likes: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
          _count: {
            select: {
              bookmarks: true,
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: LIMIT + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > LIMIT) {
        const nextItem = posts.pop();
        if (nextItem) nextCursor = nextItem.id;
      }

      return { posts, nextCursor: nextCursor };
    }),
  getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input: { slug, userId }, ctx: { prisma } }) => {
      const post = await prisma.post.findFirst({
        where: {
          slug,
        },
        select: {
          title: true,
          description: true,
          tags: true,
          id: true,
          featuredImage: true,
          html: true,
          slug: true,
          text: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          isPublished: true,
          bookmarks: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
          likes: userId
            ? {
                where: {
                  userId,
                },
              }
            : false,
          _count: {
            select: {
              bookmarks: true,
              likes: true,
              comments: true,
              tags: true,
            },
          },
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
  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
    }),
  removeBookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
    }),
  dislikePost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
      });
    }),
});
