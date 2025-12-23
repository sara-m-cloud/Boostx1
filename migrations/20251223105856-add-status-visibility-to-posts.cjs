"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "status", {
      type: Sequelize.ENUM(
        "draft",
        "open",
        "in_progress",
        "completed",
        "cancelled"
      ),
      defaultValue: "open",
    });

    await queryInterface.addColumn("posts", "visibility", {
      type: Sequelize.ENUM("public", "private"),
      defaultValue: "public",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("posts", "status");
    await queryInterface.removeColumn("posts", "visibility");
  },
};
