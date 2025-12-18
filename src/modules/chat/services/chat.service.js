import { db } from "../../../db/db.connection.js";
import { Op } from "sequelize";

const { Chat, Message, User } = db;

export const getChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.uid;

  const chat = await Chat.findByPk(chatId, {
    include: [
      { model: User, as: "client", attributes: ["uid", "name"] },
      { model: User, as: "freelancer", attributes: ["uid", "name"] },
      {
        model: Message,
        as: "messages",
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["uid", "name"],
          },
        ],
        order: [["createdAt", "ASC"]],
      },
    ],
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // 🔐 authorization
  if (![chat.clientId, chat.freelancerId].includes(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json({
    message: "Done",
    data: { chat },
  });
};

export const openChat = async (req, res) => {
  const userId = req.user.uid;
  const { otherUserId ,projectId} = req.body;

  if (!otherUserId) {
    return res.status(400).json({ message: "otherUserId is required" });
  }

  // 1️⃣ دور على شات موجود
  let chat = await Chat.findOne({
    where: {
      [Op.or]: [
        { clientId: userId, freelancerId: otherUserId },
        { clientId: otherUserId, freelancerId: userId },
      ],
    },
  });

  // 2️⃣ لو مش موجود → أنشئيه
  if (!chat) {
    chat = await Chat.create({
      clientId: userId,
      freelancerId: otherUserId,
      projectId
    });
  }

  res.json({
    message: "Done",
    data: { chat },
  });
};
export const listChats = async (req, res) => {
  const userId = req.user.uid;

  const chats = await Chat.findAll({
    where: {
      [Op.or]: [
        { clientId: userId },
        { freelancerId: userId }
      ]
    },
    include: [
      {
        model: User,
        as: "client",
        attributes: ["uid", "name", "imageUrl"]
      },
      {
        model: User,
        as: "freelancer",
        attributes: ["uid", "name", "imageUrl"]
      },
      {
        model: Message,
        as: "messages",
        separate: true,               // ⭐ مهم
        limit: 1,
        order: [["createdAt", "DESC"]],
        attributes: ["message", "createdAt"]
      }
    ]
  });

  res.json({ message: "Done", data: { chats } });
};


