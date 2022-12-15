import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { tagSchema } from "../../../components/TagModal";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const tagRouter = router({
  createTag: protectedProcedure
    .input(tagSchema)
    .mutation(async ({ ctx: { prisma }, input: { name, description } }) => {
      const slug = slugify(name);

      const existingTag = await prisma.tag.findUnique({
        where: {
          name: name,
        },
      });

      if (existingTag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "tag name already exists!",
        });
      }

      await prisma.tag.create({
        data: {
          name,
          description,
          slug,
        },
      });
    }),
  getTags: publicProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.tag.findMany();
  }),
});
