import { Router } from "express";
import {authentication } from "../../middleware/auth.middleware.js";
import * as chatservice from "./services/chat.service.js"
const router = Router();
router.get("/listchats", authentication(),chatservice.listChats);
router.get("/:chatId", authentication(),chatservice.getChat);
router.post("/open", authentication(),chatservice.openChat);



export default router;
