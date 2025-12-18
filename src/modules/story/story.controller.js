import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import * as storyservice from "./services/story.service.js"
// import {validationfile } from "../../utils/multer/uploadedimage.js";
// import { uploadstory } from "../../utils/multer/local.multer.js";
// import { endpoint } from "./story.authorization.js";
import { roletypes } from "../../db/models/User.model.js";
import { uploadStoryMedia } from "./media/upload.storymedia.js";
const router = Router();

router.post(
  "/createstory",
  authentication(),
  authorization([roletypes.Admin]),   // ✅ Admin فقط
uploadStoryMedia,storyservice.createstory
);
router.post(
  "/viewstory/:storyId",
  authentication(), 
  storyservice.viewStory
);
router.get(
  "/getstoryviews/:storyId",
  authentication(),
  authorization([roletypes.Admin]), // نفس الصلاحيات
  storyservice.getStoryViewers
);
router.get(
  "/stories",
  authentication(),
  storyservice.getActiveStories
);
router.delete(
  "/deletestory/:storyId",
  authentication(),
  authorization([roletypes.Admin]),
  storyservice.deleteStory
);



export default router;