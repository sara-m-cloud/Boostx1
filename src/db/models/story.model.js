// models/Story.js
export default (sequelize, DataTypes) => {
  const Story = sequelize.define("Story", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    uid: {
      // صاحب الاستوري (User.uid)
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetRole: {
  type: DataTypes.ENUM("client"),
  allowNull: false,
},


    mediaType: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
    },

    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
   
  });

  Story.associate = (models) => {
    // Story belongs to User
    Story.belongsTo(models.User, {
      foreignKey: "uid",
      as: "user",
      onDelete: "CASCADE",
    });

    // Story has many views
    Story.hasMany(models.StoryView, {
      foreignKey: "storyId",
      as: "views",
      onDelete: "CASCADE",
    });
  };

  return Story;
};
