export default (sequelize, DataTypes) => {
  const Vendor = sequelize.define("Vendor", {
    uid: { type: DataTypes.INTEGER, primaryKey: true },
    totalProjects: DataTypes.INTEGER,
    type: DataTypes.STRING,        // نوع البائع (freelancer / agency / vendor)
    rate: DataTypes.DOUBLE,
    noOfRestricted: DataTypes.INTEGER,
    skills: DataTypes.JSON,
    totalBalance: DataTypes.DOUBLE,
  });

  Vendor.associate = (models) => {
    Vendor.belongsTo(models.User, { foreignKey: "uid" });

    // VENDOR CHILD MODELS
    Vendor.hasOne(models.Freelancer, { foreignKey: "vendorUid" });
    Vendor.hasOne(models.Agency, { foreignKey: "vendorUid" });
  };

  return Vendor;
};
