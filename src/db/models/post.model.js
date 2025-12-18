export default (sequelize, DataTypes) => {
  const Post = sequelize.define(
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
    },
    {
    
      timestamps: true,
    }
  );

  Post.associate = (models) => {
    // البوست تابع Vendor
    Post.belongsTo(models.Vendor, {
      foreignKey: "vendorUid",
      targetKey: "vendorUid",
        as: "vendor",  
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // تصنيف البوست
    Post.belongsTo(models.Category, {
      foreignKey: "categoryId",
        as: "category",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Post;
};
