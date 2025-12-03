export default (sequelize, DataTypes) => {
  const Client = sequelize.define("Client", {
    uid: { type: DataTypes.STRING, primaryKey: true },
    nationalId: DataTypes.STRING,
    nationality: DataTypes.STRING,
    savedPosts: DataTypes.JSON,
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User, { foreignKey: "uid" });
  };

  return Client;
};
