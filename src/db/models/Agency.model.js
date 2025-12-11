export default (sequelize, DataTypes) => {
  const Agency = sequelize.define("Agency", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
   vendorUid: {
  type: DataTypes.INTEGER,
  allowNull: false,
},

    packageId: DataTypes.STRING,
    categories: DataTypes.JSON,
  });

  Agency.associate = (models) => {
    Agency.belongsTo(models.Vendor, { foreignKey: "vendorUid" });
  };

  return Agency;
};
