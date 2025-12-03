export default (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    postId: { type: DataTypes.STRING, primaryKey: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    likes: DataTypes.JSON,
    comments: DataTypes.JSON,
    saved: DataTypes.JSON,
    files: DataTypes.JSON,
  });

  Post.associate = (models) => {
    Post.hasMany(models.Gallery, { foreignKey: "postId" });

    // Many to Many with Skills
    Post.belongsToMany(models.Skills, {
      through: "PostSkills",
      foreignKey: "postId",
    });
  };

  return Post;
};
