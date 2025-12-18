 import { db } from "../../../db/db.connection.js";
import { providertypes } from "../../../db/models/User.model.js";
import { emailevent } from "../../../utils/events/email.event.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { comparehash, generatehash } from "../../../utils/security/hash.js";
import  {OAuth2Client} from'google-auth-library';
import axios from "axios";
import { decodedtoken, generatetoken, tokentypes } from "../../../utils/security/token.js";
 const{User}=db
export const login = asynchandler(async (req, res, next) => {
  const {email,Password} = req.body;
  // 1) ابحث عن اليوزر بالإيميل
  const user = await User.findOne({ where: { email } });
  console.log(user);
  
  if (!user) {
    return next(new Error("in-valid account", { cause: 404 }));
  }
  console.log(Password);
  console.log(user.Password);
  
  
  // 2) تحقق من كلمة المرور
  const isMatch = comparehash({
    plaintext:Password,
    hashvalue: user.Password,  
  });
  console.log(isMatch);
  

  if (!isMatch) {
    return next(new Error("incorrect password", { cause: 404 }));
  }
  // 3) تحقق إن الإيميل متأكد
  if (!user.confirmEmail) {
    return next(
      new Error("you have to confirm your email first", { cause: 400 })
    );
  }
 // 4) توليد التوكن
const signatureUsed =
  user.role === "Admin"
    ? process.env.ADMIN_ACCESS_TOKEN
    : process.env.USER_ACCESS_TOKEN;

console.log("TOKEN SIGNED WITH:", signatureUsed);

const accesstoken = generatetoken({
  payload: { id: user.uid },
  signature: signatureUsed,
});


  
  const refreshtoken = generatetoken({
    payload: { id: user.uid },
    signature:user.role==="Admin"
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN,
  });

  // 5) رجّع الاستجابة
  return successResponse({
    res,
    status: 201,
    data: { accesstoken, refreshtoken },
  });
});
export const loginwithgmail = asynchandler(async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
  }

  const payload = await verify();

  // 1) نبحث عن اليوزر بالايميل في Sequelize
  let user = await User.findOne({
    where: {
      email: payload.email
    }
  });

  // 2) لو مش موجود → نعمله إنشاء
  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      imageUrl: payload.picture,
      provider: providertypes.google,
      confirmEmail: true
    });
  }

  // 3) لو مزود مختلف (مثلاً مسجّل عادي مش Gmail)
  if (user.provider !== providertypes.google) {
    return next(new Error("Invalid provider", { cause: 400 }));
  }
console.log(user);

  // 4) Generate Tokens
  const accessToken = generatetoken({
    payload: { uid: user.uid },
    signature: user.role=="Admin"
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN
  });

  const refreshToken = generatetoken({
    payload: { uid: user.uid },
    signature: user.role=="Admin"
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN,
  
  });

  return successResponse({
    res,
    status: 201,
    data: {
      token: {
        accessToken,
        refreshToken,
      }
    }
  });
});
export const loginWithFacebook = asynchandler(async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return next(new Error("Access Token is required", { cause: 400 }));
  }

  // 1️⃣ نجيب بيانات المستخدم من فيسبوك
  const fbURL = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;

  let fbData;
  try {
    const response = await axios.get(fbURL);
    fbData = response.data;
  } catch (err) {
    return next(new Error("Invalid Facebook access token", { cause: 400 }));
  }
  console.log("FB DATA:", fbData);


  const { id: facebookId, name, email, picture } = fbData;

  // 2️⃣ نبحث عن اليوزر بالايميل
  let user = await User.findOne({
    where: { email }
  });

  // 3️⃣ لو مش موجود → نعمله إنشاء بصيغة موحّدة
  if (!user) {
    user = await User.create({
      name,
      email,
      imageUrl: picture?.data?.url,
      provider: providertypes.facebook,   // ضيفي value "facebook" عندك في enum
      confirmEmail: true
    });
  }

  // 4️⃣ لو اليوزر Provider مختلف → Error
  if (user.provider !== providertypes.facebook) {
    return next(new Error("Invalid provider for this email", { cause: 400 }));
  }

  // 5️⃣ Generate Access & Refresh Tokens
  const accessTokenJWT = generatetoken({
    payload: { uid: user.uid },
    signature: user.role === "Admin"
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN
  });

  const refreshToken = generatetoken({
    payload: { uid: user.uid },
    signature: user.role === "Admin"
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN
  });

  // 6️⃣ Response موحّد مثل Gmail login
  return successResponse({
    res,
    status: 200,
    message: "Facebook login successful",
    data: {
      token: {
        accessToken: accessTokenJWT,
        refreshToken,
      },
      user,
    },
  });
});
export const getrefreshtoken = asynchandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // ⬅️ فك التوكن
  const user = await decodedtoken({
    authorization,
    tokentype: tokentypes.refresh,
    next,
  });
 console.log(user);
 
  
  // ⬅️ هات المستخدم من قاعدة البيانات Sequelize
  const dbUser = await User.findOne({ where: { uid: user.uid } });
 console.log("hhhhh",dbUser);
 
  if (!dbUser) return next(new Error("User not found", { cause: 404 }));

  const accesstoken = generatetoken({
    payload: { uid: dbUser.uid },
    signature: dbUser.role=="Admin"
      ? process.env.ADMIN_ACCESS_TOKEN
      : process.env.USER_ACCESS_TOKEN,
  });

  const refreshtoken = generatetoken({
    payload: { uid: dbUser.uid },
    signature: dbUser.role=="Admin"
      ? process.env.ADMIN_REFRESH_TOKEN
      : process.env.USER_REFRESH_TOKEN,
  });

  return successResponse({
    res,
    status: 201,
    data: {
      token: { accesstoken, refreshtoken },
    },
  });
});
export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  // ⬅️ جلب المستخدم من قاعدة البيانات Sequelize
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new Error("not register account", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(
      new Error("you have to confirm your email first", { cause: 400 })
    );
  }

  // ⬅️ إطلاق الحدث لإرسال البريد
  emailevent.emit("forgotpassword", { uid: user.uid, email });

  return successResponse({ res, status: 201 });
};
export const validateForgotPassword = async (req, res, next) => {
  const { email, code } = req.body;

  // 1) ابحث عن اليوزر بالايميل
  const user = await User.findOne({
    where: {
      email: email,
      isDeleted: false
    }
  });

  if (!user) {
    return next(new Error("Not registered account", { cause: 404 }));
  }

  // 2) لازم يكون عامل تأكيد إيميل
  if (!user.confirmEmail) {
    return next(new Error("You must confirm your email first", { cause: 400 }));
  }

  // 3) مقارنة OTP
  const isValid = comparehash({
    plaintext: code,
    hashvalue: user.confirmpassswordOTP
  });

  if (!isValid) {
    return next(new Error("Invalid code", { cause: 401 }));
  }
  
  // 4) Success
  return successResponse({ res, status: 201 });
};
export const resetpassword = async (req, res, next) => {
  const { email, code, Password } = req.body;

  // 1) نجيب اليوزر من Sequelize
  const user = await User.findOne({
    where: {
      email: email,
      isDeleted: false
    }
  });

  if (!user) {
    return next(new Error("Not registered account", { cause: 404 }));
  }

  // 2) لازم يكون عمل تأكيد إيميل
  if (!user.confirmEmail) {
    return next(new Error("You have to confirm your email first", { cause: 400 }));
  }

  // 3) تحقق الـ OTP
  const isValid = comparehash({
    plaintext: code,
    hashvalue: user.confirmpassswordOTP
  });

  if (!isValid) {
    return next(new Error("Invalid code", { cause: 401 }));
  }

  // 4) تحديث الباسورد + تصفير OTP + تخزين وقت التغيير
  await user.update({
    password: generatehash({ plaintext: Password }),
    confirmpassswordOTP: 0,     // تصفير الكود
    changecridentialsTime: Date.now()
  });

  return successResponse({ res, status: 201 });
};
