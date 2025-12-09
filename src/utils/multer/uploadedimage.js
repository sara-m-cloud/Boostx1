import { v4 as uuid } from "uuid";
import { getsupabase} from "./supabase.multer.js";

export const uploadMultipleBanners = async (files) => {
  const supabase = getsupabase()// ✅ مهم جدًا
  const urls = [];

  for (const file of files) {
    const fileName = `banners/${uuid()}-${file.originalname}`;

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
