import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadBannerImages = upload.array("images", 10);
// 10 = max images
