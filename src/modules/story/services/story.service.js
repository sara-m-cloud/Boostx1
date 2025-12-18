import { v4 as uuidv4 } from 'uuid';
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { db } from "../../../db/db.connection.js";
import { roletypes } from '../../../db/models/User.model.js';
import { Op, literal } from "sequelize";
import cron from "node-cron";
import { deleteStoryFolderFromSupabase, uploadStoryMediaToSupabase } from '../../../utils/multer/supabaseUploads.js';

const {sequelize}=db
const {Story,StoryView,User}=db

export const createstory = asynchandler(async (req, res, next) => {
  const { caption } = req.body;

  if (!req.files || req.files.length === 0) {
    return next(new Error("Story media is required", { cause: 400 }));
  }

  // ✅ ناخد أول ملف (Story واحدة)
  const file = req.files[0];

  // ✅ تحديد نوع الميديا
  let mediaType;
  if (file.mimetype.startsWith("image")) {
    mediaType = "image";
  } else if (file.mimetype.startsWith("video")) {
    mediaType = "video";
  } else {
    return next(new Error("Unsupported media type", { cause: 400 }));
  }

  const storyId = uuidv4()

  // ✅ Upload (نفس util بتاعك)
 const mediaUrls = await uploadStoryMediaToSupabase(req.files, storyId);


  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await Story.create({
    id: storyId,
    uid: req.user.uid,
    mediaUrl: mediaUrls[0],
    mediaType,                 // ✅ image أو video
    caption,
    targetRole: "client",
    expiresAt,
    createdby: req.user.uid,
  });

  return successResponse({
    res,
    status: 201,
    message: "story created successfully",
    data: { story },
  });
});
export const viewStory = asynchandler(async (req, res, next) => {
  const { storyId } = req.params;
  const viewerUid = req.user.uid;

  if (!storyId) {
    return next(new Error("Story id is required", { cause: 400 }));
  }
if (![roletypes.Client, roletypes.Admin].includes(req.user.role)) {
  return next(
    new Error("You are not allowed to view stories", { cause: 403 })
  );
}

  // ✅ تأكد إن الستوري موجودة
  const story = await Story.findOne({
    where: { id: storyId },
  });

  if (!story) {
    return next(new Error("Story not found", { cause: 404 }));
  }

  // ✅ صاحب الستوري نفسه لا يُحسب view
  if (story.uid === viewerUid) {
    return successResponse({
      res,
      message: "owner view ignored",
      data: { viewed: false },
    });
  }

  // ✅ هل اتشاف قبل كده؟
  const alreadyViewed = await StoryView.findOne({
    where: { storyId, viewerUid },
  });

  if (alreadyViewed) {
    return successResponse({
      res,
      message: "story already viewed",
      data: { viewed: true },
    });
  }

  // ✅ تسجيل المشاهدة في الجدول
  await StoryView.create({
    storyId,
    viewerUid,
  });

 

  return successResponse({
    res,
    status: 201,
    message: "story viewed successfully",
    data: {
      viewed: true,
     
    },
  });
});
export const getStoryViewers = asynchandler(async (req, res, next) => {
  const { storyId } = req.params;
  const currentUserUid = req.user.uid;

  if (!storyId) {
    return next(new Error("Story id is required", { cause: 400 }));
  }

  // ✅ هات الستوري
  const story = await Story.findOne({
    where: { id: storyId },
    attributes: ["id", "uid"],
  });

  if (!story) {
    return next(new Error("Story not found", { cause: 404 }));
  }

  // ✅ Authorization: صاحب الستوري فقط
  if (story.uid !== currentUserUid) {
    return next(new Error("You are not allowed to view this story analytics", { cause: 403 }));
  }

  // ✅ Group viewers
  const viewers = await StoryView.findAll({
    where: { storyId },
    attributes: [
      "viewerUid",
      [sequelize.fn("MAX", sequelize.col("viewedAt")), "lastViewedAt"],
    ],
   include: [
  {
    model: User,
    as: "viewer", // ✅ نفس alias بالظبط
    attributes: ["uid", "name", "imageUrl"],
  },
],

   group: ["StoryView.viewerUid", "viewer.uid"],

  });

  return successResponse({
    res,
    data: {
      totalViews: viewers.length,
      viewers,
    },
  });
});
export const getActiveStories = asynchandler(async (req, res) => {
  const viewerUid = req.user.uid;
  const now = new Date();

  const stories = await Story.findAll({
    where: {
      expiresAt: {
  [Op.gt]: sequelize.fn("UTC_TIMESTAMP"),
}, // ✅ لسه فعالة
      targetRole: "client",
    },
    attributes: {
      include: [
        // ✅ هل اليوزر شاف الستوري؟
        [
          literal(`(
            SELECT COUNT(*)
            FROM StoryViews
            WHERE StoryViews.storyId = Story.id
            AND StoryViews.viewerUid = ${viewerUid}
          )`),
          "viewed",
        ],
      ],
    },
    order: [
      // ✅ Unseen الأول
      [literal("viewed"), "ASC"],
      // ✅ الأحدث الأول
      ["createdAt", "DESC"],
    ],
  });

  // ✅ تحويل viewed من number → boolean
  const formattedStories = stories.map(story => ({
    ...story.toJSON(),
    viewed: story.getDataValue("viewed") > 0,
  }));

  return successResponse({
    res,
    data: {
      count: formattedStories.length,
      stories: formattedStories,
    },
  });
});
export const deleteStory = asynchandler(async (req, res, next) => {
  const { storyId } = req.params;
  const adminUid = req.user.uid;

  if (!storyId) {
    return next(new Error("Story id is required", { cause: 400 }));
  }
  console.log(storyId);
  

  // ✅ تأكد إن الستوري موجودة
  const story = await Story.findOne({
    where: { id: storyId },
  });
  console.log(story);
  

  if (!story) {
    return next(new Error("Story not found", { cause: 404 }));
  }

  // ✅ Resource-based authorization
  if (story.uid !== adminUid) {
    return next(new Error("You are not allowed to delete this story", { cause: 403 }));
  }

  // ✅ حذف المشاهدات
  await StoryView.destroy({
    where: { storyId },
  });

 


  // ✅ حذف الستوري
  await Story.destroy({
    where: { id: storyId },
  });
  await deleteStoryFolderFromSupabase(storyId);


  return successResponse({
    res,
    message: "Story deleted successfully",
  });
});
export const startDeleteExpiredStoriesJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("🕒 Running scheduled job: delete expired stories");

    try {
      await deleteExpiredStories();
    // نادينا الفانكشن اللي بنفس نمط الكنترولر
    } catch (error) {
      console.error("❌ Cron Job Failed:", error);
    }
  });

  console.log("🚀 Cron Job (Delete Expired Stories) started");
};
export const deleteExpiredStories = asynchandler(async () => {
  const now = new Date();

  // 1️⃣ هات كل الستوريز اللي انتهى وقتها
  const expiredStories = await Story.findAll({
    where: {
      expiresAt: { [Op.lt]: now },
    },
  });

  if (!expiredStories.length) {
    console.log("✔️ No expired stories found");
    return;
  }

  console.log(`📌 Found ${expiredStories.length} expired stories to delete`);

  for (const story of expiredStories) {
    const storyId = story.id;

    // 2️⃣ احذف المشاهدات
    await StoryView.destroy({
      where: { storyId },
    });

    // 3️⃣ (اختياري) لو عايزة أحذف الميديا من Supabase
    // await deleteStoryMediaFromSupabase(story.mediaUrl);

    // 4️⃣ احذف الستوري نفسها
    await Story.destroy({
      where: { id: storyId },
    });

    console.log(`🗑️ Story ${storyId} deleted`);
  }

  console.log("✅ Expired stories deleted successfully");
});
 