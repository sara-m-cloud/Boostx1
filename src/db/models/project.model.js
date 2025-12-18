

export default (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    uid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    bugetStartingFrom: DataTypes.DOUBLE,
    bugetUpTo: DataTypes.DOUBLE,
    expectedDays: DataTypes.INTEGER,
    files: DataTypes.JSON
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: "uid",
      targetKey: "uid" // 👈 مهم جدًا
    });

    Project.belongsTo(models.Category, {
      foreignKey: "categoryId",
      targetKey: "id"
    });
  };

  return Project;
};
