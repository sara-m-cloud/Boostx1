import { Router } from "express"
import { authentication, authorization } from "../../middleware/auth.middleware.js"
import { roletypes } from "../../db/models/User.model.js"
import * as postservice from "./services/post.service.js"
import { uploadpostImages } from "./image/upload.postimage.js"

const router=Router()
router.post("/createproject",authentication(),authorization([roletypes.Vendor]),uploadpostImages,postservice.createProject)
router.get("/listprojects",authentication(),postservice.listProjects)
router.get("/getproject/:projectId",authentication(),postservice.getSingleProject)
router.get("/vendor/my-project",authentication(),authorization([roletypes.Vendor]),postservice.getVendorProjects)
router.put("/updateproject/:projectId",authentication(),authorization([roletypes.Vendor]),uploadpostImages,postservice.updateProject)
router.delete("/deleteproject/:projectId",authentication(),authorization([roletypes.Vendor]),postservice.deleteProject)
export default router
