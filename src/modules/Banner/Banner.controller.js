import { Router } from "express";
import * as bannerservice from "./services/banner.service.js"
import { uploadBannerImages } from "../../utils/multer/cloud.multer.js";

const router=Router()
router.post("/addbanner",uploadBannerImages,bannerservice.addBanner)
router.post("/listbanner",uploadBannerImages,bannerservice.listBanners)
router.delete("/deletebanner/:id",bannerservice.deleteBanner)




export default router 