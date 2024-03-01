import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";


type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput['getFileMessages']['messages']