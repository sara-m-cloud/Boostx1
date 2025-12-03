export default (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    uid: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
   id: {                     // نضيف ID افتراضي
    type: DataTypes.INTEGER, // أو UUID لو عايز
    autoIncrement: true,
    primaryKey: true,
  },

    bugetStartingFrom: DataTypes.DOUBLE,
    bugetUpTo: DataTypes.DOUBLE,

    expectedDays: DataTypes.INTEGER,

    // list of files
    files: {
      type: DataTypes.JSON,   // أو TEXT حسب اختيارك
      allowNull: true
    },

    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,

    // Category foreign key must be here
    categoryId: DataTypes.STRING
  });

  Project.associate = (models) => {
    // user
    Project.belongsTo(models.User, { foreignKey: "uid" });

    // category
    Project.belongsTo(models.Category, { foreignKey: "categoryId" });

    // skills → pending your answer: Many-to-many or One-to-many?
    Project.belongsToMany(models.Skills, {
      through: "ProjectSkills",
      foreignKey: "projectId"
    });

    Project.hasMany(models.ProjectRequest, {
      foreignKey: "projectId",
      onDelete: "CASCADE"
    });
  };

  return Project;
};
