import { db } from "../../../db/db.connection.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
const{User,Vendor,Client,Freelancer,Agency,Category}=db

export const getMyProfile = asynchandler(async (req, res, next) => {
  const { uid } = req.user
 
console.log(uid);

  // 1️⃣ User
  const user = await User.findByPk(uid, {
    attributes: [
      "uid",
      "name",
      "email",
      "imageUrl",
      "description",
      "phoneNumber",
      "role",
    ],
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // 2️⃣ Vendor (اختياري)
  const vendor = await Vendor.findOne({
    where: { uid },
    attributes: [
      "vendorUid",
      "type",
      "displayName",
      "rate",
      "totalProjects",
      "totalBalance",
      "isVerified",
      "isActive",
    ],
  });

  // 🟢 CLIENT
  if (!vendor) {
    const client = await Client.findOne({ where: { uid } });

    return successResponse({
      res,
      message: "Profile fetched successfully",
      data: {
        type: "client",
        user,
        vendor: null,
        profile: client || {},
      },
    });
  }

  // 🟢 FREELANCER
  if (vendor.type === "freelancer") {
    const freelancer = await Freelancer.findOne({
      where: { vendorUid: vendor.vendorUid },
      attributes: ["nationality", "nationalityId", "categoryId"],
    });

    return successResponse({
      res,
      message: "Profile fetched successfully",
      data: {
        type: "freelancer",
        user,
        vendor,
        profile: freelancer || {},
      },
    });
  }

  // 🟢 AGENCY
  if (vendor.type === "agency") {
    const agency = await Agency.findOne({
      where: { vendorUid: vendor.vendorUid },
      attributes: ["packageId", "categories"],
    });

    return successResponse({
      res,
      message: "Profile fetched successfully",
      data: {
        type: "agency",
        user,
        vendor,
        profile: agency || {},
      },
    });
  }

  return next(new Error("Invalid profile state", { cause: 400 }));
});
export const getPublicProfile = asynchandler(async (req, res, next) => {
  const { vendorUid } = req.params;

  const vendor = await Vendor.findByPk(vendorUid, {
    attributes: [
      "vendorUid",
      "type",
      "displayName",
      "rate",
      "totalProjects",
      "isVerified"
    ],
  });

  if (!vendor) {
    return next(new Error("Profile not found", { cause: 404 }));
  }

  // freelancer
  if (vendor.type === "freelancer") {
    const freelancer = await Freelancer.findOne({
      where: { vendorUid },
    });

    return successResponse({
      res,
      data: {
        type: "freelancer",
        vendor,
        profile: freelancer || {},
      },
    });
  }

  // agency
  if (vendor.type === "agency") {
    const agency = await Agency.findOne({
      where: { vendorUid },
    });

    return successResponse({
      res,
      data: {
        type: "agency",
        vendor,
        profile: agency || {},
      },
    });
  }

  return next(new Error("Invalid profile type", { cause: 400 }));
});
export const updateUserProfile = asynchandler(async (req, res, next) => {
  const { uid } = req.user;
  const { name, description, phoneNumber, imageUrl } = req.body;

  const user = await User.findByPk(uid);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  await user.update({
    name,
    description,
    phoneNumber,
    imageUrl,
  });

  return successResponse({
    res,
    message: "User profile updated successfully",
    data: user,
  });
});
export const updateFreelancerProfile = asynchandler(async (req, res, next) => {
  const { uid } = req.user;
  const { nationality, nationalityId, categoryId } = req.body;

  const vendor = await Vendor.findOne({ where: { uid } });
  if (!vendor || vendor.type !== "freelancer") {
    return next(new Error("Not a freelancer vendor", { cause: 403 }));
  }

  const freelancer = await Freelancer.findOne({
    where: { vendorUid: vendor.vendorUid },
  });

  if (!freelancer) {
    return next(new Error("Freelancer profile not found", { cause: 404 }));
  }

  await freelancer.update({
    nationality,
    nationalityId,
    categoryId,
  });

  return successResponse({
    res,
    message: "Freelancer profile updated successfully",
    data: freelancer,
  });
});
export const updateAgencyProfile = asynchandler(async (req, res, next) => {
  const { uid } = req.user;
  const { packageId, categoryIds } = req.body;

  const vendor = await Vendor.findOne({ where: { uid } });
  if (!vendor || vendor.type !== "agency") {
    return next(new Error("Not an agency vendor", { cause: 403 }));
  }

  const agency = await Agency.findOne({
    where: { vendorUid: vendor.vendorUid },
  });

  if (!agency) {
    return next(new Error("Agency profile not found", { cause: 404 }));
  }

  // update normal fields
  if (packageId !== undefined) {
    await agency.update({ packageId });
  }

  // update categories (relation)
  if (categoryIds !== undefined) {
    if (!Array.isArray(categoryIds)) {
      return next(new Error("categoryIds must be an array", { cause: 400 }));
    }
    await agency.setCategories(categoryIds);
  }

  // 🔥 re-fetch profile with categories
  const updatedProfile = await Agency.findByPk(agency.id, {
    include: [
      {
        model: Category,
        as: "Categories",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
  });

  return successResponse({
    res,
    message: "Agency profile updated successfully",
    data: {
      profile: updatedProfile,
    },
  });
});

export const updateClientProfile = asynchandler(async (req, res, next) => {
  const { uid } = req.user;
  const { nationalId, nationality, savedPosts } = req.body;

  const client = await Client.findOne({ where: { uid } });

  if (!client) {
    return next(new Error("Client profile not found", { cause: 404 }));
  }

  await client.update({
    nationalId,
    nationality,
    savedPosts,
  });

  return successResponse({
    res,
    message: "Client profile updated successfully",
    data: client,
  });
});


