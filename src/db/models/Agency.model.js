export default (sequelize, DataTypes) => {
  const Agency = sequelize.define("Agency", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    vendorUid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    packageId: DataTypes.STRING,
  });

  Agency.associate = (models) => {
    Agency.belongsTo(models.Vendor, { foreignKey: "vendorUid" });

    Agency.belongsToMany(models.Category, {
      through: models.AgencyCategory,
      foreignKey: "agencyId",
      otherKey: "categoryId",
    });
  };

  return Agency;
};
