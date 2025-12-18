import { getsupabase } from "./supabase.multer.js";
import {uploadToSupabase } from "./uploadToSupabase.js";
export const validationfile = {
  // ✅ صور فقط
  imageOnly: {
    fileSize: 20 * 1024 * 1024, // 20 MB
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  },

  // ✅ صور + فيديو
  imageOrVideo: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ],
  },

  // ✅ فيديو فقط
  videoOnly: {
    fileSize: 100 * 1024 * 1024, // 100 MB
    mimeTypes: [
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ],
  },
};

// 🔹 Banners
export const uploadMultipleBanners = (files, bannerId) =>
  uploadToSupabase({
    files,
    bucket: "banners",
    folder: bannerId,
    allowedMimeTypes: validationfile.imageOrVideo.mimeTypes,
  });

// 🔹 Stories
export const  uploadStoryMediaToSupabase = (files, storyId) =>
  uploadToSupabase({
    files,
    bucket: "stories",
    folder: storyId,
    allowedMimeTypes: validationfile.imageOrVideo.mimeTypes,
  });
export const deleteStoryFolderFromSupabase = async (storyId) => {
  const supabase = getsupabase();

  // 1️⃣ هات كل الملفات جوه الفولدر
  const { data: files, error } = await supabase.storage
    .from("stories")
    .list(storyId);

  if (error) throw error;

  if (!files || !files.length) return;

  // 2️⃣ حضّر paths
  const paths = files.map(file => `${storyId}/${file.name}`);

  // 3️⃣ امسحهم
  const { error: deleteError } = await supabase.storage
    .from("stories")
    .remove(paths);

  if (deleteError) throw deleteError;
};


// 🔹 Posts
export const uploadPostImages = (files, postId) =>
  uploadToSupabase({
    files,
    bucket: "posts",
    folder: postId,
    allowedMimeTypes: validationfile.imageOrVideo.mimeTypes,
  });

// 🔹 Category (single image)
export const uploadCategoryImage = async (file, categoryId) => {
  const [url] = await uploadToSupabase({
    files: [file],
    bucket: "categories",
    folder: categoryId,
    allowedMimeTypes: validationfile.imageOnly.mimeTypes
  });

  return url;
};
