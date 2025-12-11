export default (sequelize, DataTypes) => {
  const TeamLeader = sequelize.define("TeamLeader", {
    uid: { type: DataTypes.INTEGER, primaryKey: true },
    log: DataTypes.TEXT,
  });

  TeamLeader.associate = (models) => {
    TeamLeader.belongsTo(models.User, { foreignKey: "uid" });
  };

  return TeamLeader;
};
