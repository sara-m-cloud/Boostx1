"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("CartItems", {
      unique: true,
      fields: ["cartId", "projectId"],
      name: "unique_cart_project",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "CartItems",
      "unique_cart_project"
    );
  },
};

