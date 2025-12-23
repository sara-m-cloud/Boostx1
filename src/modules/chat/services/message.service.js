import { db } from "../../../db/db.connection.js";
import { authentication } from "../../../middleware/socket/socket.auth.middleware.js";
import { Op } from "sequelize";
const { Chat, Message, User } = db;

// export const sendMessages = (io, socket) => {
//   socket.on("sendMessage", async ({ chatId, message }) => {
//     try {
//       // 1️⃣ auth
//       const { valid, data } = await authentication({ socket });
//       if (!valid) {
//         return socket.emit("socket_Error", data);
//       }

//       const userId = data.user.uid;

//       // 2️⃣ chat exists?
//       const chat = await Chat.findByPk(chatId);
//       if (!chat) {
//         return socket.emit("socket_Error", {
//           message: "Chat not found",
//         });
//       }

//       // 3️⃣ authorization
//       if (![chat.clientId, chat.freelancerId].includes(userId)) {
//         return socket.emit("socket_Error", {
//           message: "Not allowed",
//         });
//       }

//       // 4️⃣ create message
//       const newMessage = await Message.create({
//         chatId,
//         message,
//         senderId: userId,
//       });

//       // 5️⃣ populate sender
//       const fullMessage = await Message.findByPk(newMessage.id, {
//         include: [
//           {
//             model: User,
//             as: "sender",
//             attributes: ["uid", "name", "email"],
//           },
//         ],
//       });
//       const receiverId =
//   userId === chat.clientId ? chat.freelancerId : chat.clientId;
// io.to(`user_${receiverId}`).emit("unreadUpdate", {
//   chatId,
// });

// // للغير فقط
// socket.broadcast.to(`chat_${chatId}`).emit("receiveMessage", {
//   chatId,
//   message: fullMessage,

// });


// // // للـ sender فقط
// // socket.emit("successMessage", {
// //   chatId,
// //   message: fullMessage,
// // });

//     } catch (error) {
//       console.error(error);
//       socket.emit("socket_Error", {
//         message: "Failed to send message",
//       });
//     }
//   });
// };

export const sendMessages = (io, socket) => {
  socket.on("sendMessage", async ({ chatId, message }) => {
    try {
      // 1️⃣ auth
      const { valid, data } = await authentication({ socket });
      if (!valid) {
        return socket.emit("socket_Error", data);
      }

      const senderId = data.user.uid;

      // 2️⃣ chat exists?
      const chat = await Chat.findByPk(chatId);
      if (!chat) {
        return socket.emit("socket_Error", { message: "Chat not found" });
      }

      // 3️⃣ authorization
      if (![chat.clientId, chat.freelancerId].includes(senderId)) {
        return socket.emit("socket_Error", { message: "Not allowed" });
      }

      // 4️⃣ receiver
      const receiverId =
        senderId === chat.clientId ? chat.freelancerId : chat.clientId;

      // 5️⃣ create message
      const newMessage = await Message.create({
        chatId,
        message,
        senderId,
        receiverId,
        seenAt: null,
        isRead: false,
      });

      // 6️⃣ populate sender
      const fullMessage = await Message.findByPk(newMessage.id, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["uid", "name", "email"],
          },
        ],
      });

      // 7️⃣ هل الريسيفر فاتح الشات؟
      const socketsInRoom = await io.in(`chat_${chatId}`).fetchSockets();

      const receiverInsideChat = socketsInRoom.some(
        (s) => s.user?.uid === receiverId
      );

      // 8️⃣ لو فاتح الشات → Seen فورًا
      if (receiverInsideChat) {
        await newMessage.update({
          seenAt: new Date(),
          isRead: true,
        });
        console.log(
  socketsInRoom.map(s => ({
    socketId: s.id,
    userId: s.user?.uid
  }))
);


        io.to(`chat_${chatId}`).emit("seenUpdate", {
          chatId,
          messageId: newMessage.id,
        });
      } else {
        // مش فاتح الشات → unread
        io.to(`user_${receiverId}`).emit("unreadUpdate", {
          chatId,
        });
      }

      // 9️⃣ ابعت الرسالة
      socket.broadcast.to(`chat_${chatId}`).emit("receiveMessage", {
        chatId,
        message: fullMessage,
      });

      // socket.emit("successMessage", {
      //   chatId,
      //   message: fullMessage,
      // });
    } catch (error) {
      console.log(error);
      socket.emit("socket_Error", { message: "Send message failed" });
    }
  });
};

export const messagesSeen = (socket) => {
  socket.on("messagesSeen", async ({ chatId }) => {
    if (!chatId) return;

    const { data, valid } = await authentication({ socket });
    if (!valid) {
      return socket.emit("socket_Error", data);
    }

    const userId = data.user.uid;

    try {
      const [count] = await Message.update(
        { seenAt: new Date() },
        {
          where: {
            chatId,
            senderId: { [Op.ne]: userId },
            seenAt: null,
          },
        }
      );

      socket.emit("messagesSeenDone", { chatId, seenCount: count });

      socket.to(`chat_${chatId}`).emit("seenUpdate", {
        chatId,
        seenBy: userId,
      });

    } catch (error) {
      socket.emit("socket_Error", { message: "Failed to update seen" });
    }
  });
};

