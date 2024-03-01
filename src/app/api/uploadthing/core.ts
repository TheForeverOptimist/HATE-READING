import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { userAgent } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { Index } from "@upstash/vector";
import { OpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });


export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) throw new Error("UNAUTHORIZED");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdfile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://utfs.io/f/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const index = new Index({
          url: process.env.UPSTASH_VECTOR_REST_URL as string,
          token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
        });

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const upstashVector = new UpstashVectorStore(embeddings, {
          index,
        });

        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        
        try{
          await upstashVector.addDocuments(pageLevelDocs);
        }catch(err){
          console.error("Error generating or indexing embeddings:", err)
        }

        // Waiting vectors to be indexed in the vector store.
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const queryResult = await upstashVector.similaritySearchWithScore("The company and influencer agree to enter into a partnership", 1);
        console.log("queryResult: ", queryResult);

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdfile.id,
          },
        });
      } catch (err) {
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdfile.id,
          },
        });
      }
    }),
} as FileRouter;

export type OurFileRouter = typeof ourFileRouter;