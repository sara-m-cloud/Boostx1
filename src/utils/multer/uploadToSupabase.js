import { v4 as uuid } from "uuid";
import { getsupabase } from "./supabase.multer.js";

export const uploadToSupabase = async ({
  files,
  bucket,
  folder,
  allowedMimeTypes,
}) => {
  const supabase = getsupabase();
  const urls = [];

  for (const file of files) {
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    const fileName = `${folder}/${uuid()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    urls.push(data.publicUrl);
  }

  return urls;
};
