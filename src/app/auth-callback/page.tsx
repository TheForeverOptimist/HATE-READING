"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="w-full mt-24 flex justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
      <h3 className="font-semibold text-xl">Setting up your account ...</h3>
      <p>You will be redirected automatically</p>
    </div>
  </div>
);

const AuthCallbackContent = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading, error } = trpc.authCallback.useQuery();

    useEffect(() => {
      if (!isLoading) {
        if (error) {
          // Handle errors (e.g., unauthorized access)
          if (error.data?.code === "UNAUTHORIZED") {
            router.push("/sign-in");
          } else {
            // Optionally handle other types of errors or provide generic error handling
            router.push("/error"); // Redirecting to a generic error page
          }
        } else if (data && data.success) {
          // Redirect to origin if available, otherwise go to dashboard
          router.push(origin || "/dashboard");
        } else {
          // Handle case where data might not be as expected
          router.push("/sign-in");
        }
      }
    }, [data, isLoading, error, origin, router]);

    // No need to return any JSX as this component only handles redirection
    return null;
};

const Page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
};

export default Page;
