export default (sequelize, DataTypes) => {
  const Skills = sequelize.define("Skills", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
  });

  Skills.associate = (models) => {
    Skills.belongsTo(models.Category, { foreignKey: "categoryId" });

    Skills.belongsToMany(models.Post, {
      through: "PostSkills",
      foreignKey: "skillId",
    });
  };

  return Skills;
};
