import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import isDataURI from "validator/lib/isDataURI";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../../env/server.mjs";
import mime from "mime-types";
import { randomUUID } from "crypto";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

export const userRouter = router({
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        imageBase64DataURI: z
          .string()
          .refine(
            (val) => isDataURI(val),
            "image should be in data uri format"
          ),
        mimetype: z.string(),
      })
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { imageBase64DataURI, mimetype },
      }) => {
        // `image` here is a base64 encoded data URI, it is NOT a base64 string, so we need to extract
        // the real base64 string from it.
        // Check the syntax here: https://en.wikipedia.org/wiki/Data_URI_scheme#Syntax
        const imageBase64Str = imageBase64DataURI.replace(/^.+,/, "");

        const buf = Buffer.from(imageBase64Str, "base64");

        const { data: previousImageData } = await supabase.storage
          .from("images")
          .list("avatars", {
            search: session.user.username,
          });

        if (previousImageData)
          await supabase.storage
            .from("images")
            .remove(previousImageData?.map((data) => `avatars/${data.name}`));

        const { data: uploadedImage, error } = await supabase.storage
          .from("images")
          .upload(
            `avatars/${session.user.username}-${randomUUID()}.${mime.extension(
              mimetype
            )}`,
            buf,
            {
              cacheControl: "3600",
              upsert: true,
              contentType: mimetype,
            }
          );

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(uploadedImage.path);

          await prisma.user.update({
            where: {
              id: session.user.id,
            },
            data: {
              image: publicUrl,
            },
          });
        }
      }
    ),
  getCurrentUser: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      return await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          email: true,
          username: true,
          image: true,
          id: true,
          name: true,
        },
      });
    }
  ),
  getUserProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          name: true,
          username: true,
          image: true,
          _count: {
            select: {
              followers: true,
              followings: true,
              posts: true,
            },
          },
        },
      });
    }),
});
