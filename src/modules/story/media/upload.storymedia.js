import { uploadMedia } from "../../../utils/multer/local.multer.js";


export const uploadStoryMedia = uploadMedia({
  fieldName: "media",      // اسم الحقل في form-data
  maxCount: 5,             // عدد ملفات الستوري
  fileSize: 50 * 1024 * 1024, // 50MB
  mimeTypes: [
    // 🖼 Images
    "image/jpeg",
    "image/png",
    "image/webp",

    // 🎥 Videos
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ],
});
