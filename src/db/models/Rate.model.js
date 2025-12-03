// models/Rate.js
export default (sequelize, DataTypes) => {
  const Rate = sequelize.define("Rate", {
    rateId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    completedProjId: DataTypes.STRING,
    rate: DataTypes.DOUBLE,
    comment: DataTypes.STRING,
  });

  Rate.associate = (models) => {
    Rate.belongsTo(models.CompletedProject, {
      foreignKey: "completedProjId",
      as: "completedProject",
    });

    Rate.hasOne(models.Activity, {
      foreignKey: "rateId",
      as: "activity",
    });
  };

  return Rate;
};
