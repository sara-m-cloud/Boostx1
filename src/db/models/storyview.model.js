// models/StoryView.js
export default (sequelize, DataTypes) => {
  const StoryView = sequelize.define(
    "StoryView",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      storyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      viewerUid: {
        // اليوزر اللي شاف الاستوري
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      viewedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["storyId", "viewerUid"], // ✅ Unique view
        },
      ],
    }
  );

  StoryView.associate = (models) => {
    // View belongs to Story
    StoryView.belongsTo(models.Story, {
      foreignKey: "storyId",
      as: "story",
      onDelete: "CASCADE",
    });

    // View belongs to User (viewer)
    StoryView.belongsTo(models.User, {
      foreignKey: "viewerUid",
      as: "viewer",
      onDelete: "CASCADE",
    });
  };

  return StoryView;
};
