import joi from "joi";


export const signupValidation = joi.object().keys({
//   imageUrl: joi.string().uri().allow(null, ""),
  description: joi.string().allow(null, ""),
  email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["com", "net"] } }),
  Password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).required(),
  role: joi.string().valid("admin", "client", "vendor", "employee", "teamLeader", "freelancer", "agency").required(),
  name: joi.string().min(2).max(50).required(),
  phoneNumber: joi.string().pattern(/^\+?\d{7,15}$/).allow(null, ""),
//   createdAt: joi.date().iso().required()
}).unknown(true)
