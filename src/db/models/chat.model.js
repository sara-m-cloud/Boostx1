// models/chat.model.js
export default (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // ⭐ شات واحد لكل مشروع
      },

      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      freelancerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "chats",
    }
  );

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
      foreignKey: "clientId",
      as: "client",
    });

    Chat.belongsTo(models.User, {
      foreignKey: "freelancerId",
      as: "freelancer",
    });

    Chat.hasMany(models.Message, {
      foreignKey: "chatId",
      as: "messages",
      onDelete: "CASCADE",
    });
  };

  return Chat;
};
