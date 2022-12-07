import { TRPCError } from "@trpc/server";
import { createApi } from "unsplash-js";
import { querySchema } from "../../../components/UnsplashGallary";
import { env } from "../../../env/server.mjs";

import { protectedProcedure, router } from "../trpc";

const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});

export const unsplashRouter = router({
  getImages: protectedProcedure
    .input(querySchema)
    .query(async ({ input: { query } }) => {
      try {
        const data = await unsplash.search.getPhotos({
          query,
          orderBy: "relevant",
          orientation: "landscape",
        });
        return data.response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "not able to fetch images from unsplash server",
        });
      }
    }),
});
