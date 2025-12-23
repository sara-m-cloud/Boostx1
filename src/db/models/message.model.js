// models/message.model.js
export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

isRead: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
}
,
seenAt: {
  type: DataTypes.DATE,
  allowNull: true,
},

      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "messages",
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.Chat, {
      foreignKey: "chatId",
      as: "chat",
    });

    Message.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
    });
  };

  return Message;
};
