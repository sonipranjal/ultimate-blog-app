import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentRouter = router({
  createComment: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      await prisma.comment.create({
        data: {
          ...input,
          userId: session.user.id,
        },
      });
    }),
  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      return comments;
    }),
});
