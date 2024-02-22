import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core.ts";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
