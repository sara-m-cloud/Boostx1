
import { v4 as uuidv4 } from "uuid";
import { db} from "../../../db/db.connection.js";
import { successResponse } from "../../../utils/response/success.response.js";

import { asynchandler } from "../../../utils/response/error.response.js";
import { uploadMultipleBanners } from "../../../utils/multer/uploadedimage.js";

const { Banner } = db;

export const addBanner = asynchandler(async (req, res, next) => {
  const { title, redirectUrl } = req.body;


   if (!req.files || req.files.length === 0) {
    return next(new Error("Images are required", { cause: 400 }));
  }

  const imageUrls = await uploadMultipleBanners(req.files);

  // ✅ 2) حفظ البيانات في DB
  const banner = await Banner.create({
    id: uuidv4(),
    title,
    images: imageUrls,
    redirectUrl,
    isActive: true
  });

  return successResponse({
    res,
    status: 201,
    message: "banner created successfully",
    data: banner
  });
});
export const listBanners = asynchandler(async (req, res, next) => {

  const banners = await Banner.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]]
  });

  if (!banners.length) {
    return next(new Error("no banners found", { cause: 404 }));
  }

  return successResponse({
    res,
    status: 200,
    message: "banners fetched successfully",
    data: banners
  });
});
export const deleteBanner = asynchandler(async (req, res, next) => {
  const { id } = req.params;

  const banner = await Banner.findByPk(id);

  if (!banner) {
    return next(new Error("banner not found", { cause: 404 }));
  }

  await banner.destroy();

  return successResponse({
    res,
    status: 200,
    message: "banner deleted successfully"
  });
});
