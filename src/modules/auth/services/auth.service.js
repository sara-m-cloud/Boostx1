import { v4 as uuidv4 } from "uuid";
 // استدعي الموديل بتاع User من db connection

// import { emailevent } from "../events/email.event.js";

import { generatehash } from "../../../utils/security/hash.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import UserModel from "../../../db/models/User.model.js";
import { db } from "../../../db/db.connection.js";
const {User}=db

export const signup = asynchandler(async (req, res, next) => {
  const {
    description,
    email,
    Password, // كلمة السر بالـ camelCase زي اللي بعتيه
    role,
    imageUrl,
    name,
    phoneNumber,
  } = req.body;

  // التأكد من وجود البريد الإلكتروني مسبقاً
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new Error("The email already exists", { cause: 409 }));
  }
  const hashedPassword =generatehash({plaintext:Password});
  const user = await User.create({
    uid: uuidv4(), // إنشاء UUID تلقائي
    imageUrl,
    description,
    email,
    Password: hashedPassword,
    role,
    name,
    phoneNumber,
    createdAt:new Date().toISOString(),
  });

  // إرسال بريد تأكيد
//   emailevent.emit("sendconfirmemail", { email });

  return successResponse({ res, status: 201, data: { uid: user.uid, email: user.email } });
});
