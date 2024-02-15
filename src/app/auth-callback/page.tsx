import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";
import { useEffect } from "react";

const Page = async () => {
    const router = useRouter()

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    const {data} = trpc.authCallback.useQuery();

    useEffect(() => {
        if(data?.success) {
            router.push(origin ? `/${origin}` : '/dashboard');
        }
    }, [data, router, origin]);


}


export default Page