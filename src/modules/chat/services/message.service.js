import { db } from "../../../db/db.connection.js";
import { authentication } from "../../../middleware/socket/socket.auth.middleware.js";

const { Chat, Message, User } = db;

export const sendMessages = (io, socket) => {
  socket.on("sendMessage", async ({ chatId, message }) => {
    try {
      // 1️⃣ auth
      const { valid, data } = await authentication({ socket });
      if (!valid) {
        return socket.emit("socket_Error", data);
      }

      const userId = data.user.uid;

      // 2️⃣ chat exists?
      const chat = await Chat.findByPk(chatId);
      if (!chat) {
        return socket.emit("socket_Error", {
          message: "Chat not found",
        });
      }

      // 3️⃣ authorization
      if (![chat.clientId, chat.freelancerId].includes(userId)) {
        return socket.emit("socket_Error", {
          message: "Not allowed",
        });
      }

      // 4️⃣ create message
      const newMessage = await Message.create({
        chatId,
        message,
        senderId: userId,
      });

      // 5️⃣ populate sender
      const fullMessage = await Message.findByPk(newMessage.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["uid", "name", "email"],
          },
        ],
      });
// للغير فقط
socket.broadcast.to(`chat_${chatId}`).emit("receiveMessage", {
  chatId,
  message: fullMessage,
  
});

// // للـ sender فقط
// socket.emit("successMessage", {
//   chatId,
//   message: fullMessage,
// });

    } catch (error) {
      console.error(error);
      socket.emit("socket_Error", {
        message: "Failed to send message",
      });
    }
  });
};
