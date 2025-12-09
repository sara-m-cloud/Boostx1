import { v4 as uuidv4 } from "uuid";
import { db } from "../../../db/db.connection.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
const{Category}=db

export const addCategory = asynchandler(async (req, res, next) => {
  const { name, icon, colorIcon, minimumBudget } = req.body;

  // 1) Check: required field
  if (!name) {
    return next(new Error("name is required", { cause: 400 }));
  }

  // 2) Check: category already exists
  const exists = await Category.findOne({
    where: { name }
  });

  if (exists) {
    return next(new Error("category already exists", { cause: 409 }));
  }

  // 3) Create category
  const category = await Category.create({
    id: uuidv4(),
    name,
    icon,
    colorIcon,
    minimumBudget,
  });

  // 4) Send success like confirmEmail format
  return successResponse({
    res,
    status: 201,
    message: "category created successfully",
    data: category,
  });
});
export const listCategories = asynchandler(async (req, res, next) => {

  // 1) Fetch all categories
  const categories = await Category.findAll();

  // 2) لو فاضية
  if (categories.length === 0) {
    return next(new Error("no categories found", { cause: 404 }));
  }

  // 3) Return response (نفس شكل confirmEmail)
  return successResponse({
    res,
    status: 200,
    message: "categories fetched successfully",
    data: categories,
  });
});
