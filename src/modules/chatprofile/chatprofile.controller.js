import { Router } from "express";
import {authentication } from "../../middleware/auth.middleware.js";
import * as profileservice from "./services/chatprofile.service.js"
const router = Router();

router.get("/profile", authentication(),profileservice.getchatProfile);

export default router;
