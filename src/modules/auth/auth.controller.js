import { Router } from "express";
import * as authservice from "./services/auth.service.js"
import { validateUser } from "../../middleware/validation.middleware.js";
import * as authvalidation from "./auth.validation.js"
import * as loginservice from "./services/login.service.js"
const router=Router()
router.post("/signup",validateUser(authvalidation.signupValidation),authservice.signup)
router.post("/confirmemail",validateUser(authvalidation.confirmemailValidation),authservice.confirmEmail)
router.post("/login",validateUser(authvalidation.loginValidation),loginservice.login)
router.post("/getrefreshtoken",loginservice.getrefreshtoken)
router.post("/forgetpassword",loginservice.forgotpassword)
router.post("/validateforgetpassword",loginservice.validateForgotPassword)
router.post("/resetpassword",loginservice.resetpassword)
router.post("/loginwithgmail",loginservice.loginwithgmail)
export default router 