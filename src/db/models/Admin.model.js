export default (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    uid: { type: DataTypes.STRING, primaryKey: true },
    adminTransaction: DataTypes.TEXT,
  });

  Admin.associate = (models) => {
    Admin.belongsTo(models.User, { foreignKey: "uid" });
  };

  return Admin;
};
