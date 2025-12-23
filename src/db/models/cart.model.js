// models/cart.model.js
export default (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    cartId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    clientUid: { type: DataTypes.INTEGER, allowNull: false }, // FK -> Client.uid

    status: {
      type: DataTypes.ENUM("active", "checked_out"),
      defaultValue: "active",
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Client, { foreignKey: "clientUid", as: "client" });

    Cart.hasMany(models.CartItem, {
      foreignKey: "cartId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return Cart;
};
