import { Router } from "express";
import {authentication } from "../../middleware/auth.middleware.js";
import * as profileservice from "./services/profile.service.js"
const router = Router();

router.get("/profile", authentication(),profileservice.getProfile);

export default router;
