export default (sequelize, DataTypes) => {
  const Freelancer = sequelize.define("Freelancer", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    vendorUid: {
  type: DataTypes.INTEGER,
  allowNull: false,
},

    nationalityId: DataTypes.STRING,
    nationality: DataTypes.STRING,

    categoryId: { type: DataTypes.STRING }, // FK → Category.id
  });

  Freelancer.associate = (models) => {
    Freelancer.belongsTo(models.Vendor, { foreignKey: "vendorUid" });

    // ⭐ أهم ربط
    Freelancer.belongsTo(models.Category, { foreignKey: "categoryId" });
  };

  return Freelancer;
};
