import { db } from "../../../db/db.connection.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";

const { Cart, CartItem, Project, Vendor, Client } = db
export const addToCart = asynchandler(async (req, res, next) => {
  const clientUid = req.user.uid;
  const { projectId } = req.params;

  if (!projectId) {
    return next(new Error("Project ID is required", { cause: 400 }));
  }

  const client = await Client.findByPk(clientUid);
  if (!client) {
    return next(new Error("Only clients can add to cart", { cause: 403 }));
  }

  const project = await Project.findByPk(projectId);
  if (!project) {
    return next(new Error("Project not found", { cause: 404 }));
  }

  if (project.status !== "available" && project.status !== "open") {
    return next(new Error("Project is not available", { cause: 400 }));
  }

  // ❌ منع شراء مشروعك
  const vendor = await Vendor.findOne({ where: { uid: clientUid } });
  if (vendor && vendor.vendorUid === project.vendorUid) {
    return next(
      new Error("You cannot add your own project to cart", { cause: 403 })
    );
  }

  // 🛒 get or create cart
  let cart = await Cart.findOne({
    where: { clientUid, status: "active" },
  });

  if (!cart) {
    cart = await Cart.create({ clientUid });
  }

  try {
    await CartItem.create({
      cartId: cart.cartId,
      projectId: project.id,
      vendorUid: project.vendorUid,
      priceSnapshot: project.budget,
    });
  } catch (error) {
    return next(
      new Error("Project already exists in cart", { cause: 400 })
    );
  }

  return successResponse({
    res,
    status: 201,
    message: "Project added to cart successfully",
  });
});
export const getMyCart = asynchandler(async (req, res, next) => {
  const clientUid = req.user.uid;

  const client = await Client.findByPk(clientUid);
  if (!client) {
    return next(new Error("Only clients can access cart", { cause: 403 }));
  }

  const cart = await Cart.findOne({
    where: { clientUid, status: "active" },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          {
            model: Project,
            as: "project",
          },
          {
            model: Vendor,
            as: "vendor",
            attributes: ["vendorUid", "displayName", "rate"],
          },
        ],
      },
    ],
  });

  return successResponse({
    res,
    message: "Cart fetched successfully",
    data: cart || { items: [] },
  });
});
export const removeFromCart = asynchandler(async (req, res, next) => {
  const clientUid = req.user.uid;
  const { projectId } = req.params;

  const cart = await Cart.findOne({
    where: { clientUid, status: "active" },
  });

  if (!cart) {
    return next(new Error("Active cart not found", { cause: 404 }));
  }

  const deleted = await CartItem.destroy({
    where: {
      cartId: cart.cartId,
      projectId,
    },
  });

  if (!deleted) {
    return next(
      new Error("Project not found in cart", { cause: 404 })
    );
  }

  return successResponse({
    res,
    message: "Project removed from cart successfully",
  });
});
export const clearCart = asynchandler(async (req, res, next) => {
  const clientUid = req.user.uid;

  const cart = await Cart.findOne({
    where: { clientUid, status: "active" },
  });

  if (!cart) {
    return next(new Error("Cart is already empty", { cause: 400 }));
  }

  await CartItem.destroy({
    where: { cartId: cart.cartId },
  });

  return successResponse({
    res,
    message: "Cart cleared successfully",
  });
});


