export async function up(queryInterface) {
  await queryInterface.dropTable("projects");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.createTable("projects", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
}
