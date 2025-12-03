import { Router } from "express";
import * as authservice from "./services/auth.service.js"
import { validateUser } from "../../middleware/validation.middleware.js";
import * as authvalidation from "./auth.validation.js"
const router=Router()
router.post("/signup",validateUser(authvalidation.signupValidation),authservice.signup)
export default router 