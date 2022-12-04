import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { unsplashRouter } from "./unsplash";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  unsplash: unsplashRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
