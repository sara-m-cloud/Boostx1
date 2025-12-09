export const providertypes={
  google:"google",
  system:"system"
}
export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
 uid: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
}
,
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: { type: DataTypes.STRING, unique: true },
   password: {
  type: String,
  required: (data) => data?.provider == providertypes.google ? false : true
}
,
    role: DataTypes.STRING,
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    // createdAt: DataTypes.STRING,
    provider: {
  type: DataTypes.ENUM(...Object.values(providertypes)),
  allowNull: false,
  defaultValue: providertypes.system
}
,
    confirmEmailOTP:DataTypes.STRING,
    confirmpassswordOTP:DataTypes.STRING,
    confirmEmail: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
changeCridentialsTime: {
  type: DataTypes.DATE,
  allowNull: true,
},

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
