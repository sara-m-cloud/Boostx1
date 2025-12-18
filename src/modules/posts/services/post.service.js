import { db } from "../../../db/db.connection.js";
import { uploadPostImages } from "../../../utils/multer/supabaseUploads.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
const{Vendor,Post,Category}=db
export const createPost = asynchandler(async (req, res, next) => {
  const { title, description, budget, categoryId } = req.body;

  // ✅ validation أساسي
  if (!title || !description) {
    return next(
      new Error("Title and description are required", { cause: 400 })
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new Error("Post images are required", { cause: 400 }));
  }

  console.log("USER UID:", req.user.uid);

  // ✅ 1) هات Vendor من uid
  const vendor = await Vendor.findOne({
    where: { uid: req.user.uid, isActive: true },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  // ✅ 2) إنشاء الـ Post
  const post = await Post.create({
    vendorUid: vendor.vendorUid,
    title,
    description,
    budget,
    categoryId,
    isActive: true,
  });

  console.log("POST ID:", post.id);

  // ✅ 3) رفع الصور
  const imageUrls = await uploadPostImages(
    req.files,
    vendor.vendorUid,
    post.id
  );

  // ✅ 4) تحديث البوست بالصور
  await post.update({
    image: imageUrls, // JSON array
  });

  return successResponse({
    res,
    status: 201,
    message: "Post created successfully",
    data: {
      post,
      images: imageUrls,
    },
  });
});
export const listPosts = asynchandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    budget_min,
    budget_max,
    sort,
  } = req.query;

  const offset = (page - 1) * limit;

  const whereCondition = {
    isActive: true,
  };

  if (search) {
    whereCondition.title = {
      [Op.like]: `%${search}%`, // ✅ MySQL
    };
  }

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (budget_min || budget_max) {
    whereCondition.budget = {};
    if (budget_min) whereCondition.budget[Op.gte] = Number(budget_min);
    if (budget_max) whereCondition.budget[Op.lte] = Number(budget_max);
  }

  let order = [["createdAt", "DESC"]];

  if (sort === "budget_asc") {
    order = [["budget", "ASC"]];
  } else if (sort === "budget_desc") {
    order = [["budget", "DESC"]];
  }

  const { rows: posts, count } = await Post.findAndCountAll({
    where: whereCondition,
    limit: Number(limit),
    offset: Number(offset),
    order,
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: ["vendorUid", "displayName"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  return successResponse({
    res,
    message: "Posts fetched successfully",
    data: {
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      posts,
    },
  });
});
export const getSinglePost = asynchandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findOne({
    where: {
      id: postId,
      isActive: true,
    },
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: ["vendorUid", "displayName"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!post) {
    return next(new Error("Post not found", { cause: 404 }));
  }

  return successResponse({
    res,
    message: "Post fetched successfully",
    data: post,
  });
});
export const getVendorPosts = asynchandler(async (req, res, next) => {
  // 1️⃣ user uid من التوكن
  const userUid = req.user.uid;

  // 2️⃣ هات الـ Vendor
  const vendor = await Vendor.findOne({
    where: {
      uid: userUid,
      isActive: true,
    },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  // 3️⃣ هات بوستات الفيندور
  const posts = await Post.findAll({
    where: {
      vendorUid: vendor.vendorUid, // ✅ الصح
    },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return successResponse({
    res,
    message: "Vendor posts fetched successfully",
    data: posts,
  });
});
export const updatePost = asynchandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, description, budget, categoryId } = req.body;

  // 1️⃣ user uid
  const userUid = req.user.uid;

  // 2️⃣ هات Vendor
  const vendor = await Vendor.findOne({
    where: {
      uid: userUid,
      isActive: true,
    },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  // 3️⃣ هات البوست
  const post = await Post.findOne({
    where: {
      id: postId,
      vendorUid: vendor.vendorUid,
      isActive: true,
    },
  });

  if (!post) {
    return next(new Error("Post not found or not authorized", { cause: 404 }));
  }

  // 4️⃣ حدّث البيانات (لو موجودة)
  await post.update({
    title: title ?? post.title,
    description: description ?? post.description,
    budget: budget ?? post.budget,
    categoryId: categoryId ?? post.categoryId,
  });

  // 5️⃣ لو فيه صور → حدّث الصور
  if (req.files && req.files.length > 0) {
    // (اختياري) امسحي الصور القديمة من storage هنا

    const imageUrls = await uploadPostImages(
      req.files,
      vendor.vendorUid,
      post.id
    );

    await post.update({
      image: imageUrls,
    });
  }

  return successResponse({
    res,
    message: "Post updated successfully",
    data: post,
  });
});

export const deletePost = asynchandler(async (req, res, next) => {
  const { postId } = req.params;

  // 1️⃣ user uid
  const userUid = req.user.uid;

  // 2️⃣ هات Vendor
  const vendor = await Vendor.findOne({
    where: {
      uid: userUid,
      isActive: true,
    },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  // 3️⃣ هات البوست وتأكد إنه بتاعه
  const post = await Post.findOne({
    where: {
      id: postId,
      vendorUid: vendor.vendorUid,
      isActive: true,
    },
  });

  if (!post) {
    return next(new Error("Post not found or not authorized", { cause: 404 }));
  }

  // 4️⃣ Soft delete
  await post.update({
    isActive: false,
  });

  return successResponse({
    res,
    message: "Post deleted successfully",
  });
})


