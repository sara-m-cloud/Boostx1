export default (sequelize, DataTypes) => {
  const Activity = sequelize.define("Activity", {
    activityId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    completedProjId: DataTypes.STRING,
    rateId: DataTypes.STRING,
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.CompletedProject, {
      foreignKey: "completedProjId",
      as: "completedProject",
    });

    Activity.belongsTo(models.Rate, {
      foreignKey: "rateId",
      as: "rate",
    });
  };

  return Activity;
};
