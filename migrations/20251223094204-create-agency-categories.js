export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("AgencyCategories", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    agencyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Agencies", // اسم جدول Agency في DB
        key: "id",
      },
      onDelete: "CASCADE",
    },

    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categories", // اسم جدول Category في DB
        key: "id",
      },
      onDelete: "CASCADE",
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("AgencyCategories");
}
