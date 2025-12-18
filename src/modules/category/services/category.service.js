import { v4 as uuidv4 } from "uuid";
import { db } from "../../../db/db.connection.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { uploadCategoryImage } from "../../../utils/multer/supabaseUploads.js";

const{Category,Skills,Project }=db
export const createCategory = asynchandler(async (req, res, next) => { 
  const { name, minimumBudget } = req.body;
console.log(minimumBudget);

  if (!name) {
    return next(new Error("Category name is required", { cause: 400 }));
  }

  const exists = await Category.findOne({ where: { name } });
  if (exists) {
    return next(new Error("Category already exists", { cause: 409 }));
  }

  // 1️⃣ أنشئ Category الأول (علشان نجيب ID)
  const category = await Category.create({
    name,
     minimumBudget

  });
  console.log(category.id);
  
console.log(req.file);

  // 2️⃣ لو في صورة → ارفعها
  if (req.file) {
    const imageUrl = await uploadCategoryImage(req.file, category.id);
    category.image = imageUrl;
    await category.save();
  }

  return successResponse({
    res,
    status: 201,
    message: "Category created successfully",
    data: category
  });
});
export const listCategoriesAdvanced = asynchandler(async (req, res, next) => {

  const {
    page = 1,
    limit = 10,
  
    sort
  } = req.query;

  // 🧮 Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;



  // 🔃 Sorting
  let order = [["createdAt", "DESC"]];
  if (sort === "budget_asc") {
    order = [["minimumBudget", "ASC"]];
  } else if (sort === "budget_desc") {
    order = [["minimumBudget", "DESC"]];
  }

  // 📦 Query
  const { rows: categories, count } = await Category.findAndCountAll({
    limit: limitNumber,
    offset,
    order,
    include: [
      {
        model: Skills,
        as: "skills",
        attributes: ["id", "name"],
        required: false
      },
      {
        model: Project,
        as: "projects",
        attributes: ["id", "title"],
        required: false
      }
    ]
  });

  // ❌ No data
  if (!categories || categories.length === 0) {
    return next(new Error("No categories found", { cause: 404 }));
  }

  // ✅ Response
  return successResponse({
    res,
    status: 200,
    message: "Categories fetched successfully",
    data: {
      total: count,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(count / limitNumber),
      categories
    }
  });
});
export const getCategoryById = asynchandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  return successResponse({
    res,
    status: 200,
    message: "Category fetched successfully",
    data: category
  });
});
export const updateCategory = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, minimumBudget } = req.body;

  const category = await Category.findByPk(id);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  if (name) category.name = name;
  if (minimumBudget !== undefined) category.minimumBudget = minimumBudget;

  if (req.file) {
    const imageUrl = await uploadCategoryImage(req.file, category.id);
    category.image = imageUrl;
  }

  await category.save();

  return successResponse({
    res,
    status: 200,
    message: "Category updated successfully",
    data: category
  });
});
export const deleteCategory = asynchandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  category.isActive = false;
  await category.save();

  return successResponse({
    res,
    status: 200,
    message: "Category deactivated successfully"
  });
});



