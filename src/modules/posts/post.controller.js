import { Router } from "express"
import { authentication, authorization } from "../../middleware/auth.middleware.js"
import { roletypes } from "../../db/models/User.model.js"
import * as postservice from "./services/post.service.js"
import { uploadpostImages } from "./image/upload.postimage.js"

const router=Router()
router.post("/createpost",authentication(),authorization([roletypes.Vendor]),uploadpostImages,postservice.createPost)
router.get("/listposts",authentication(),postservice.listPosts)
router.get("/getpost/:postId",authentication(),postservice.getSinglePost)
router.get("/vendor/my-posts",authentication(),postservice.getVendorPosts)
router.put("/updatepost/:postId",authentication(),authorization([roletypes.Vendor]),uploadpostImages,postservice.updatePost)
router.delete("/deletepost/:postId",authentication(),authorization([roletypes.Vendor]),postservice.deletePost)
export default router