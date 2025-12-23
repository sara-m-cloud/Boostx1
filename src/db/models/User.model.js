export const providertypes={
  google:"google",
  system:"system",
  facebook:"facebook"
}
export const roletypes={
    Admin:"Admin",
    User:"User",
    Client:"Client",
    Vendor:"Vendor",
  
   
}
export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
 uid: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},isDeleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},

    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: { type: DataTypes.STRING, unique: true },
Password: {
  type: DataTypes.STRING,
  // allowNull: false, // لا يسمح بـ null في أي حالة
  validate: {
    checkRequired(value) {
      if (this.provider === providertypes.google) {
        return; // OK
      }
      if (!value) {
        throw new Error("Password is required for non-Google accounts");
      }
    }
  }
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
  defaultValue: true,
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
  User.hasMany(models.Banner, {
    foreignKey: "createdBy",
    as: "banners"
  });
    User.hasMany(models.Chat, {
    foreignKey: "clientId",
    as: "clientChats"
  });

  User.hasMany(models.Chat, {
    foreignKey: "freelancerId",
    as: "freelancerChats"
  });


    User.hasMany(models.CompletedProject, { foreignKey: "uid" });
  };

  return User;
};
