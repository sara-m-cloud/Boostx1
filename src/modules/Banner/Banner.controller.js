import { Router } from "express";
import * as bannerservice from "./services/banner.service.js"
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { roletypes } from "../../db/models/User.model.js";
import { uploadBannerImages } from "./image/upload.bannerimage.js";

const router=Router()
router.post("/addbanner",authentication(),authorization([roletypes.Admin]),uploadBannerImages,bannerservice.addBanner)
router.post("/listbanner",authentication(),bannerservice.listBanners)
router.delete("/deletebanner/:id",authentication(),authorization([roletypes.Admin]),bannerservice.deleteBanner)

export default router 