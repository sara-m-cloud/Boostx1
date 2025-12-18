import { uploadMedia } from "../../../utils/multer/local.multer.js";

export const uploadpostImages = uploadMedia({
  fieldName: "images",
  maxCount: 10,
  fileSize: 50 * 1024 * 1024,
  mimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
});
