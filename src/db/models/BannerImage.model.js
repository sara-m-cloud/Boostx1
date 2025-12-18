export default (sequelize, DataTypes) => {
  const BannerImage = sequelize.define("BannerImage", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    bannerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });
 BannerImage.associate = (models) => {
  BannerImage.belongsTo(models.Banner, {
    foreignKey: "bannerId"
  });
};



  return BannerImage;
};
