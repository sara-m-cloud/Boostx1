
import { v4 as uuidv4 } from "uuid";
import { db} from "../../../db/db.connection.js";
import { successResponse } from "../../../utils/response/success.response.js";

import { asynchandler } from "../../../utils/response/error.response.js";

import { Op } from "sequelize";
import { uploadMultipleBanners } from "../../../utils/multer/supabaseUploads.js";

const { Banner,BannerImage ,User} = db;

export const addBanner = asynchandler(async (req, res, next) => {
  const {
    title,
    position,
    linkType,
    linkValue,
    startAt,
    endAt
  } = req.body;
//  const bannerId = uuidv4();
  // ✅ validation أساسي
  if (!position || !linkType || !linkValue) {
    return next(new Error("Missing required banner fields", { cause: 400 }));
  }

  if (!req.files || req.files.length === 0) {
    return next(new Error("Banner images are required", { cause: 400 }));
  }

  // ✅ 1) رفع الصور 
 
console.log(req.user.uid);

  // ✅ 2) إنشاء البانر
  const banner = await Banner.create({
    title,
    position,
    linkType,
    linkValue,
    startAt,
    endAt,
    isActive: true,
    createdBy: req.user.uid // 👈 من التوكن
  });
  console.log("hhh",banner.id);
  
   const imageUrls = await uploadMultipleBanners(req.files,banner.id);
console.log(imageUrls);

  // ✅ 3) ربط الصور بالبانر
  const bannerImages = imageUrls.map((url, index) => ({
    bannerId: banner.id,
    imageUrl: url,
    order: index + 1
  }));

  await BannerImage.bulkCreate(bannerImages);

  return successResponse({
    res,
    status: 201,
    message: "Banner created successfully",
    data: {
      banner,
      images: bannerImages
    }
  });
});

export const listBanners = asynchandler(async (req, res, next) => {
  const { position } = req.query;
  const now = new Date();

  const whereCondition = {
    isActive: true,
    [Op.or]: [
      // بانر دائم
      {
        startAt: null,
        endAt: null
      },
      // بانر في وقته
      {
        startAt: { [Op.lte]: now },
        endAt: { [Op.gte]: now }
      }
    ]
  };

  if (position) {
    whereCondition.position = position;
  }

  const banners = await Banner.findAll({
    where: whereCondition,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: BannerImage,
        as: "images",
        attributes: ["id", "imageUrl", "order"],
        separate: true,
        order: [["order", "ASC"]]
      },
      {
        model: User,
        as: "creator",
        attributes: ["uid", "name"] // عدّلي حسب جدولك
      }
    ]
  });

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
    return next(new Error("Banner not found", { cause: 404 }));
  }

  // Soft delete
  banner.isActive = false;
  await banner.save();

  return successResponse({
    res,
    status: 200,
    message: "Banner deactivated successfully"
  });
});

