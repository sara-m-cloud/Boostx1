export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    colorIcon: DataTypes.STRING,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Skills, { foreignKey: "categoryId" });
    // Category.hasMany(models.Freelancer, { foreignKey: "categoryId" });

    Category.hasMany(models.Project, { foreignKey: "categoryId" });
  };

  return Category;
};
