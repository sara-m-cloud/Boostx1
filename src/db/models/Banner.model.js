export default (sequelize, DataTypes) => {
  const Banner = sequelize.define("Banner", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
images: {
  type: DataTypes.JSON
}
,

    redirectUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return Banner;
};
