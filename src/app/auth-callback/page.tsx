'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Page = () => {
    const router = useRouter()

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    const {data, isLoading, error} = trpc.authCallback.useQuery(undefined);

    useEffect(() => {
        //error code unauthorized
        if(error?.data?.code === "UNAUTHORIZED"){
            router.push("/sign-in")
        } else if(!isLoading){
            router.push((data !== undefined && data.success && origin) ? `${origin}` : '/dashboard');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading]);

    onerror:(err:any) => {
        if(err.data?.code === "UNAUTHORIZED"){
            router.push("/sign-in")
        }
    }
    retry: true
    retryDelay: 500

    

    return(
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className="font-semibold text-xl">Setting up your account ...</h3>
                <p>You will be redirected automatically</p>
            </div>
        </div>
    )

}


export default Page