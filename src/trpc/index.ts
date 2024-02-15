import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })


    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
