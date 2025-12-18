export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
        autoIncrement: true
      
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true
    },

    minimumBudget: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Category.associate = (models) => {
    Category.hasMany(models.Skills, {
      foreignKey: "categoryId",
      as: "skills"
    });

    Category.hasMany(models.Project, {
      foreignKey: "categoryId",
      as: "projects"
    });
  };

  return Category;
};

