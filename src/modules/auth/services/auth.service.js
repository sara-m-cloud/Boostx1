import { v4 as uuidv4 } from "uuid";
import { comparehash, generatehash } from "../../../utils/security/hash.js";
import { asynchandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { db } from "../../../db/db.connection.js";
import { roleMap } from "../../../utils/roles/rolemap.js";
import { emailevent } from "../../../utils/events/email.event.js";
const { User, Admin, Freelancer, Vendor, Agency } = db;
export const signup = asynchandler(async (req, res, next) => {
  const { description, email, Password, role, imageUrl, name, phoneNumber } = req.body;
const existingUser = await User.findOne({ 
  where: { email } 
});

if (existingUser) {
  return next(new Error("The email already exists", { cause: 409 }));
}
  const hashedPassword = generatehash({ plaintext:Password });
  const user = await User.create({
    uid: uuidv4(),
    description,
    email,
    Password:hashedPassword,
    role,
    imageUrl,
    name,
    phoneNumber,
    createdAt: new Date().toISOString(),
  });
  console.log(user.uid);
  // // --- إذا الدور مالوش جدول فرعي ---
  // const roleData = roleMap[role];
  // if (!roleData) {
  //   return res.status(201).json({ message: "User registered", user });
  // }

  // // --- إنشاء sub-user ---
  // const { model, fields } = roleData;
  // const subData = { uid: user.uid };

  // fields.forEach((field) => {
  //   if (req.body[field] !== undefined) subData[field] = req.body[field];
  // });

  // await db[model].create(subData);
    emailevent.emit("sendconfirmemail",{email})

  return successResponse({
    res,
    status: 201,
    data: { uid: user.uid, email: user.email },
  });
});
export const confirmEmail = asynchandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return next(new Error("in-valid account", { cause: 404 }));
  }
  if (user.confirmemail) {
    return next(new Error("the account already verified", { cause: 409 }));
  }
  console.log(user.confirmEmailOTP);
  if (!comparehash({ plaintext: code, hashvalue: user.confirmEmailOTP })) {
    return next(new Error("in-valid code", { cause: 401 }));
  }
  // تحديث المستخدم
  await User.update(
    { confirmEmail: true, confirmEmailOTP: 0 },
    { where: { email } }
  );

  return successResponse({ res, message: "the account is verified", status: 201 ,data:user.confirmemail});
});
