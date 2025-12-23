import { Router } from "express"
import { authentication, authorization } from "../../middleware/auth.middleware.js"
import * as profileservice from "./services/profile.services.js"
import { roletypes } from "../../db/models/User.model.js"
const router=Router()
router.get("/getmyprofile",authentication(),profileservice.getMyProfile)
router.get("/getpublicprofile/:vendorUid",authentication(),profileservice.getPublicProfile)
router.put("/updateuserprofile",authentication(),authorization([roletypes.Vendor,roletypes.Client,roletypes.Admin]),profileservice.updateUserProfile)
router.put("/updatefreelancerprofile",authentication(),authorization([roletypes.Vendor]),profileservice.updateFreelancerProfile)
router.put("/updateagencyprofile",authentication(),authorization([roletypes.Vendor]),profileservice.updateAgencyProfile)
router.put("/updateclientprofile",authentication(),authorization([roletypes.Client]),profileservice.updateClientProfile)
export default router