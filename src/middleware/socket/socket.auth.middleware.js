import { db } from "../../db/db.connection.js";
import { tokentypes, verifytoken } from "../../utils/security/token.js";

const{User}=db
export const socketConnection = new Map();

export const authentication = async ({
  socket = {},
  tokentype = tokentypes.access,
  roletypes = []
}) => {
console.log(socket);

  const [bearer, token] =
    socket?.handshake?.auth?.authorization?.split(" ") || [];

  console.log({ bearer, token });

  if (!bearer || !token) {
    return {
      data: { message: "authorization required" },
      statuscode: 401
    };
  }

  let access_signature = "";
  let refresh_signature = "";

  switch (bearer) {
    case "Admin":
      access_signature = process.env.ADMIN_ACCESS_TOKEN;
      refresh_signature = process.env.ADMIN_REFRESH_TOKEN;
      break;

    case "User":
      access_signature = process.env.USER_ACCESS_TOKEN;
      refresh_signature = process.env.USER_REFRESH_TOKEN;
      break;

    default:
      return {
        data: { message: "invalid token type" },
        statuscode: 401
      };
  }
  console.log("RAW AUTH:", socket.handshake.auth.authorization);
console.log("BEARER:", bearer);
console.log("TOKEN:", token);
console.log("VERIFY WITH:", access_signature);

  // ✅ Verify Token
  const decoded = verifytoken({
    token,
    signature:
      tokentype === tokentypes.access
        ? access_signature
        : refresh_signature
  });

  if (!decoded?.id) {
    return {
      data: { message: "invalid token payload" },
      statuscode: 401
    };
  }

  // ✅ Find User (Sequelize)
  const user = await User.findOne({
    where: {
      uid: decoded.id,
    }
  });

  if (!user) {
    return {
      data: { message: "not registered account" },
      statuscode: 404
    };
  }

  // ✅ Check credential change
  if (
    user.changeCredentialsTime &&
    user.changeCredentialsTime.getTime() >= decoded.iat * 1000
  ) {
    return {
      data: { message: "invalid login credentials" },
      statuscode: 400
    };
  }

  // ✅ Role Authorization (اختياري)
  // if (roletypes.length && !roletypes.includes(user.role)) {
  //   return {
  //     data: { message: "not authorized" },
  //     statuscode: 403
  //   };
  // }

  // ✅ Attach user to socket (مهم)
  socket.user = user;

  return {
    data: { message: "DONE", user },
    valid: true
  };
};