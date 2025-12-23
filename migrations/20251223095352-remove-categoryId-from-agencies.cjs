"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Agencies");

    if (table.categoryId) {
      await queryInterface.removeColumn("Agencies", "categoryId");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Agencies", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
