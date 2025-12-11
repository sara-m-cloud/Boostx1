export default (sequelize, DataTypes) => {
  const Gallery = sequelize.define("Gallery", {
    id: { type: DataTypes.STRING, primaryKey: true },
    postId: { type: DataTypes.STRING },     // FK → Post.postId
    galleryId: DataTypes.STRING,            // gallery unique id

    // ممكن تضيفي list of images هنا لو عايزة
    files: { type: DataTypes.JSON },        
  });

  Gallery.associate = (models) => {
    Gallery.belongsTo(models.Post, { foreignKey: "postId" });
  };

  return Gallery;
};
