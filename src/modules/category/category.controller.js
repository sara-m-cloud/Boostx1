import { Router } from "express";
import * as categoryservice from "./services/category.service.js"
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { roletypes } from "../../db/models/User.model.js";
import { uploadSingleImage } from "./image/upload.categoryimage.js";
const router=Router()
router.post("/addcategory",authentication(),authorization([roletypes.Admin]),uploadSingleImage,categoryservice.createCategory)
router.get("/listcategories",authentication(),categoryservice.listCategoriesAdvanced)
router.get("/getcategory/:id",authentication(),categoryservice.getCategoryById)
router.put("/updatecategory/:id",authentication(),authorization([roletypes.Admin]),uploadSingleImage,categoryservice.updateCategory)
router.delete("/deletecategory/:id",authentication(),authorization([roletypes.Admin]),categoryservice.deleteCategory)

export default router 