import { Router } from "express"
import * as cartservice from "./services/cart.services.js"
import { authentication } from "../../middleware/auth.middleware.js"
const router=Router()
router.post("/addtocart/:projectId",authentication(),cartservice.addToCart)
router.get("/getmycart",authentication(),cartservice.getMyCart)
router.delete("/removefromcart/:projectId",authentication(),cartservice.removeFromCart)
router.delete("/clearcart",authentication(),cartservice.clearCart)
export default router

