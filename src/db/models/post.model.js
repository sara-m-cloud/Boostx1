export default (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      vendorUid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER,
       // عشان SET NULL
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
  type: DataTypes.JSON, // array of urls
  allowNull: true,
}
,

      budget: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
  type: DataTypes.ENUM(
    "draft",
    "open",
    "in_progress",
    "completed",
    "cancelled"
  ),
  defaultValue: "open",
},

visibility: {
  type: DataTypes.ENUM("public", "private"),
  defaultValue: "public",
},

    },
    {
    
      timestamps: true,
    }
  );

  Project.associate = (models) => {
    // البوست تابع Vendor
    Project.belongsTo(models.Vendor, {
      foreignKey: "vendorUid",
      targetKey: "vendorUid",
        as: "vendor",  
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
Project.hasMany(models.CartItem, { foreignKey: "projectId", as: "cartItems" });

    // تصنيف البوست
    Project.belongsTo(models.Category, {
      foreignKey: "categoryId",
        as: "category",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Project;
};
