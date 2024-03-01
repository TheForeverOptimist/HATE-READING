import { db } from "@/db";
import { SendMessageValidator } from "@/libs/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  //endpoint for asking a question to a pdf file

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
//@ts-ignore
  const {id: userId} = user

  if (!userId) 
    return new Response("Unauthorized", { status: 401 });

    const {fileId, message} = SendMessageValidator.parse(body)

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        }
    })

    if(!file) return new Response('Not found', {status: 404})

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        }
    })
    //this is where we ask a LLM
}
