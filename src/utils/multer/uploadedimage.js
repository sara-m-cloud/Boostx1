import { v4 as uuid } from "uuid";
import { getsupabase} from "./supabase.multer.js";
export const validationfile = {
  imageOrVideo: {
    fileSize: 50 * 1024 * 1024, // 50MB
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ],
  },
};

export const uploadMultipleBanners = async (files,bannerId) => {
  const supabase = getsupabase()// ✅ مهم جدًا
  const urls = [];

  for (const file of files) {
   const fileName = `${bannerId}/${uuid()}-${file.originalname}`;


    const { error } = await supabase.storage
      .from("banners")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("banners")
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
};
export const uploadStoryMedia = async (files, storyId) => {
  const supabase = getsupabase();
  const urls = [];

  const allowedMimeTypes = validationfile.imageOrVideo.mimeTypes;
  for (const file of files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    const fileName = `${storyId}/${uuid()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from("stories")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("stories")
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
};

