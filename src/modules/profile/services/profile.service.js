import { db } from "../../../db/db.connection.js";

const {User,Chat}=db
export const getProfile = async (req, res) => {
  const userId = req.user.uid;
  console.log(userId);
  

  const user = await User.findByPk(userId, {
    attributes: ["uid", "name", "email"],
    include: [
      {
        model: Chat,
        as: "clientChats",
        include: [
          { model: User, as: "freelancer", attributes: ["uid", "name"] },
        ],
      },
      {
        model: Chat,
        as: "freelancerChats",
        include: [
          { model: User, as: "client", attributes: ["uid", "name"] },
        ],
      },
    ],
  });

  const chats = [
    ...user.clientChats,
    ...user.freelancerChats,
  ];

  res.json({
    message: "Done",
    data: {
      user: {
        ...user.toJSON(),
        chats,
      },
    },
  });
};
