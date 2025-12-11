import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadBannerImages = upload.array("images", 10);
// 10 = max images



// ✅ لازم memoryStorage عشان نستخدم file.buffer مع Supabase

export const uploadstory = (validation) =>
  multer({
  storage : multer.memoryStorage(),
    limits: {
      fileSize: validation.fileSize, // الحد الأقصى للحجم
    },
    fileFilter: (req, file, cb) => {
      if (!validation.mimeTypes.includes(file.mimetype)) {
        cb(new Error("Invalid file type"), false);
      } else {
        cb(null, true);
      }
    },
  });


