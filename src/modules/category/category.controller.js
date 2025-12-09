import { Router } from "express";
import * as categoryservice from "./services/category.service.js"
const router=Router()
router.post("/addcategory",categoryservice.addCategory)
router.get("/getcategory",categoryservice.listCategories)


export default router 