import jwt from "jsonwebtoken";
import { db } from "../../db/db.connection.js";
const{User}=db

// Generate Token
export const generatetoken = ({
  payload = {},
  signature = process.env.USER_ACCESS_TOKEN,
  expiresin = process.env.EXPIRESIN,
} = {}) => {
  const token = jwt.sign(payload, signature);
  return token;
};

// Verify Token
export const verifytoken = ({
  token = "",
  signature = process.env.USER_ACCESS_TOKEN,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};

export const tokentypes = {
  access: "access",
  refresh: "refresh",
};

// Decode Token + Get User (Sequelize Version)
export const decodedtoken = async ({
  authorization = "",
  tokentype = tokentypes.access,
  next = {},
} = {}) => {
  const [bearer, token] = authorization?.split(" ") || [];
  console.log({ bearer, token });

  let access_signature = "";
  let refresh_signature = "";

  // Signature Routing
  switch (bearer) {
    case "Admin":
      refresh_signature = process.env.ADMIN_REFRESH_TOKEN;
      access_signature = process.env.ADMIN_ACCESS_TOKEN;
      break;

    case "User":
      access_signature = process.env.USER_ACCESS_TOKEN;
      refresh_signature = process.env.USER_REFRESH_TOKEN;
      break;

    default:
      break;
  }

  // Decode JWT
  const decoded = verifytoken({
    token,
    signature:
      tokentype == tokentypes.access ? access_signature : refresh_signature,
  });
console.log(decoded.id);
console.log(decoded);


  if (!decoded?.id) {
    return next(new Error("in-valid token payload", { cause: 401 }));
  }

  // Fetch user from Sequelize
  const user = await User.findOne({
    where: {
      uid:decoded.id, // SQL → مفيش _id
      isDeleted: false, // لازم تكوني عاملة العمود ده
    },
  });
  console.log(user);
  

  if (!user) {
    return next(new Error("not register account", { cause: 404 }));
  }

  // Check if credentials changed (كلمة سر اتغيرت بعد التوكن)
  // في SQL لازم تساعديني تعرفي اسم العمود عندك
  if (
    user.changeCridentialsTime &&
    new Date(user.changeCridentialsTime).getTime() >= decoded.iat * 1000
  ) {
    return next(new Error("in-valid login credentails", { cause: 400 }));
  }

  return user;
};
