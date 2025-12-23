import { db } from "../../../db/db.connection.js";
import { uploadPostImages } from "../../../utils/multer/supabaseUploads.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
const { Vendor, Project, Category } = db;
export const createProject = asynchandler(async (req, res, next) => {
  const {
    title,
    description,
    budget,
    categoryId,
    visibility = "public",
  } = req.body;

  if (!title || !description) {
    return next(new Error("Title and description are required", { cause: 400 }));
  }

  if (!req.files || req.files.length === 0) {
    return next(new Error("Project images are required", { cause: 400 }));
  }

  const vendor = await Vendor.findOne({
    where: { uid: req.user.uid, isActive: true },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  // 1️⃣ create project
  const createdProject = await Project.create({
    vendorUid: vendor.vendorUid,
    title,
    description,
    budget,
    categoryId,
    status: "open",
    visibility,
    isActive: true,
  });

  // 2️⃣ upload images
  const imageUrls = await uploadPostImages(
    req.files,
    vendor.vendorUid,
    createdProject.id
  );

  await createdProject.update({ image: imageUrls });

  // 3️⃣ fetch project with relations
  const project = await Project.findByPk(createdProject.id, {
    include: [
      {
        model: Vendor,
        as: "vendor",
        attributes: ["vendorUid", "displayName", "rate"],
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
    status: 201,
    message: "Project created successfully",
    data: project,
  });
});

import { Op } from "sequelize";

export const listProjects = asynchandler(async (req, res, next) => {
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
    visibility: "public",
    status: "open",
  };

  if (search) {
    whereCondition.title = { [Op.like]: `%${search}%` };
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
  if (sort === "budget_asc") order = [["budget", "ASC"]];
  if (sort === "budget_desc") order = [["budget", "DESC"]];
console.log("MODEL NAME:", Project.name);

  const { rows: projects, count } = await Project.findAndCountAll({
    where: whereCondition,
    limit: Number(limit),
    offset,
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
    message: "Projects fetched successfully",
    data: {
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      projects,
    },
  });
});
export const getSingleProject = asynchandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findOne({
    where: { id: projectId, isActive: true },
    include: [
      { model: Vendor, as: "vendor", attributes: ["vendorUid", "displayName"] },
      { model: Category, as: "category", attributes: ["id", "name"] },
    ],
  });

  if (!project) {
    return next(new Error("Project not found", { cause: 404 }));
  }

  return successResponse({
    res,
    message: "Project fetched successfully",
    data: project,
  });
});

export const getVendorProjects = asynchandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({
    where: { uid: req.user.uid, isActive: true },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  const projects = await Project.findAll({
    where: {
      vendorUid: vendor.vendorUid,
      isActive: true,
    },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  return successResponse({
    res,
    message: "Vendor projects fetched successfully",
    data: projects,
  });
});

export const updateProject = asynchandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { title, description, budget, categoryId, status, visibility } =
    req.body;

  const vendor = await Vendor.findOne({
    where: { uid: req.user.uid, isActive: true },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  const project = await Project.findOne({
    where: {
      id: projectId,
      vendorUid: vendor.vendorUid,
      isActive: true,
    },
  });

  if (!project) {
    return next(
      new Error("Project not found or not authorized", { cause: 404 })
    );
  }

  await project.update({
    title: title ?? project.title,
    description: description ?? project.description,
    budget: budget ?? project.budget,
    categoryId: categoryId ?? project.categoryId,
    status: status ?? project.status,
    visibility: visibility ?? project.visibility,
  });

  if (req.files && req.files.length > 0) {
    const imageUrls = await uploadPostImages(
      req.files,
      vendor.vendorUid,
      project.id
    );
    await project.update({ image: imageUrls });
  }

  return successResponse({
    res,
    message: "Project updated successfully",
    data: project,
  });
});

export const deleteProject = asynchandler(async (req, res, next) => {
  const { projectId } = req.params;

  const vendor = await Vendor.findOne({
    where: { uid: req.user.uid, isActive: true },
  });

  if (!vendor) {
    return next(new Error("Vendor not found", { cause: 403 }));
  }

  const project = await Project.findOne({
    where: {
      id: projectId,
      vendorUid: vendor.vendorUid,
      isActive: true,
    },
  });

  if (!project) {
    return next(
      new Error("Project not found or not authorized", { cause: 404 })
    );
  }

  await project.update({ isActive: false });

  return successResponse({
    res,
    message: "Project deleted successfully",
  });
});



