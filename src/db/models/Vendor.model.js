export default (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    "Vendor",
    {
      vendorUid: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
               autoIncrement: true    // المفتاح الأساسي
      },

      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,              // كل User ليه Vendor واحد
      },

      type: {
        type: DataTypes.ENUM("freelancer", "agency"),
        allowNull: false,
      },

      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      rate: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      totalProjects: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      totalBalance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
  
  );

  Vendor.associate = (models) => {
    // Vendor تابع User
    Vendor.belongsTo(models.User, {
      foreignKey: "uid",
      onDelete: "CASCADE",
    });

    // Vendor عنده Posts
    Vendor.hasMany(models.Post, {
      foreignKey: "vendorUid",
      sourceKey: "vendorUid",
      onDelete: "CASCADE",
    });

    // Vendor عنده Completed Projects
    Vendor.hasMany(models.CompletedProject, {
      foreignKey: "vendorUid",
      sourceKey: "vendorUid",
      onDelete: "CASCADE",
    });

    // Agency (لو النوع agency)
    Vendor.hasOne(models.Agency, {
      foreignKey: "vendorUid",
      sourceKey: "vendorUid",
      onDelete: "CASCADE",
    });

    // Freelancer (لو النوع freelancer)
    Vendor.hasOne(models.Freelancer, {
      foreignKey: "vendorUid",
      sourceKey: "vendorUid",
      onDelete: "CASCADE",
    });
  };

  return Vendor;
};
