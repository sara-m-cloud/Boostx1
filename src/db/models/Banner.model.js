export default (sequelize, DataTypes) => {
  const Banner = sequelize.define("Banner", {
    id: {
      type: DataTypes.INTEGER,
     
       autoIncrement: true,
      primaryKey: true
    },

    title: DataTypes.STRING,

    position: {
      type: DataTypes.STRING, // home_top, home_middle, search
      allowNull: false
    },

    linkType: {
      type: DataTypes.ENUM("internal", "external"),
      allowNull: false
    },

    linkValue: {
      type: DataTypes.STRING,
      allowNull: false
    },

    startAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    endAt: {
      type: DataTypes.DATE,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
       createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

Banner.associate = (models) => {
  Banner.hasMany(models.BannerImage, {
    foreignKey: "bannerId",
    as: "images",
  });
   Banner.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator"
  });
};


  return Banner;
};
