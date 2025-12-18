import { uploadSingleMedia } from "../../../utils/multer/local.multer.js";


export const uploadSingleImage = uploadSingleMedia({
  fieldName: "image",
  maxCount: 1,
  mimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
});
