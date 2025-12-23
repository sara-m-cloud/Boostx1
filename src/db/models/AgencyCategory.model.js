export default (sequelize, DataTypes) => {
  const AgencyCategory = sequelize.define("AgencyCategory", {
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return AgencyCategory;
};
