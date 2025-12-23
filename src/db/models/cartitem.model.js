// models/cartItem.model.js
export default (sequelize, DataTypes) => {
  const CartItem = sequelize.define("CartItem", {
    cartItemId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    cartId: { type: DataTypes.INTEGER, allowNull: false },

    projectId: { type: DataTypes.INTEGER, allowNull: false },

    vendorUid: { type: DataTypes.INTEGER, allowNull: false }, // FK -> Vendor.vendorUid

    priceSnapshot: { type: DataTypes.DOUBLE, allowNull: false },
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });

    CartItem.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });

    CartItem.belongsTo(models.Vendor, {
      foreignKey: "vendorUid",
      targetKey: "vendorUid",
      as: "vendor",
    });
  };

  return CartItem;
};
