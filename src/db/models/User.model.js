export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    uid: { type: DataTypes.STRING, primaryKey: true },
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: { type: DataTypes.STRING, unique: true },
    Password: DataTypes.STRING,
    role: DataTypes.STRING,
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    createdAt: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasOne(models.Admin, { foreignKey: "uid" });
    User.hasOne(models.Client, { foreignKey: "uid" });
    User.hasOne(models.Vendor, { foreignKey: "uid" });
    User.hasOne(models.Employee, { foreignKey: "uid" });
    User.hasOne(models.TeamLeader, { foreignKey: "uid" });
    User.hasOne(models.Freelancer, { foreignKey: "uid" });
    User.hasOne(models.Agency, { foreignKey: "uid" });

    User.hasMany(models.CompletedProject, { foreignKey: "uid" });
  };

  return User;
};
