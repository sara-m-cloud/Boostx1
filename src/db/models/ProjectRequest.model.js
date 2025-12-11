export default (sequelize, DataTypes) => {
  const ProjectRequest = sequelize.define("ProjectRequest", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    projectId: {
      type: DataTypes.INTEGER, // ✅ لازم INTEGER
      allowNull: false,
    },

    description: DataTypes.TEXT,
    totalBudget: DataTypes.DOUBLE,
    totalDays: DataTypes.INTEGER,

    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  });

  ProjectRequest.associate = (models) => {
    ProjectRequest.belongsTo(models.User, { foreignKey: "uid" });
    ProjectRequest.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return ProjectRequest;
};
