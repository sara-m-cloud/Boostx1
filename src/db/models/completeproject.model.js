// models/CompletedProject.js
export default (sequelize, DataTypes) => {
  const CompletedProject = sequelize.define("CompletedProject", {
    completedProjId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
 projectId: {              // لازم يكون نفس النوع مع العمود المرجعي
    type: DataTypes.INTEGER, // أو DataTypes.STRING لو Project.projectId هو STRING
    allowNull: false,
  },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    galleryId: DataTypes.STRING,
    files: {
      type: DataTypes.JSON, // List<String>
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  CompletedProject.associate = (models) => {
    // ⬅ العلاقة مع الـ User
    CompletedProject.belongsTo(models.User, {
      foreignKey: "uid",
      as: "user",
    });

    // ⬅ العلاقة مع الـ Project
    CompletedProject.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });

    // ⬅ العلاقة مع Activity
    CompletedProject.hasOne(models.Activity, {
      foreignKey: "completedProjId",
      as: "activity",
    });

    // ⬅ العلاقة مع Rate
    CompletedProject.hasOne(models.Rate, {
      foreignKey: "completedProjId",
      as: "rate",
    });
  };

  return CompletedProject;
};
