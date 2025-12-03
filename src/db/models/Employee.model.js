export default (sequelize, DataTypes) => {
  const Employee = sequelize.define("Employee", {
    uid: { type: DataTypes.STRING, primaryKey: true },
    rate: DataTypes.DOUBLE,
    completedTasks: DataTypes.INTEGER,
    field: DataTypes.STRING,
  });

  Employee.associate = (models) => {
    Employee.belongsTo(models.User, { foreignKey: "uid" });
  };

  return Employee;
};
