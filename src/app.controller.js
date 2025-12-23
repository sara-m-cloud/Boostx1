import { checkDBConnection, syncDBConnection } from "./db/db.connection.js"
import { globalhandlingerror } from "./utils/response/error.response.js"
import authcontroller from "./modules/auth/auth.controller.js"
 import catcontroller from "./modules/category/category.controller.js"
import bannnercontroller from "./modules/Banner/Banner.controller.js"
import postcontroller from "./modules/posts/post.controller.js"
 import storycontroller from "./modules/story/story.controller.js"
 import chatcontroller from "./modules/chat/chat.controller.js"
 import usercontroller from "./modules/chatprofile/chatprofile.controller.js"
 import profilecontroller from "./modules/profile/profile.controller.js"
 import cartcontroller from "./modules/cart/cart.controller.js"
// import { startDeleteExpiredStoriesJob } from "./modules/story/services/story.service.js"
import cors from "cors";
import { startDeleteExpiredStoriesJob } from "./modules/story/services/story.service.js"


const bootstrap=async(app,express)=>{
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res,next)=>{res.json({message:"welcome in node.js project"})})

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true
}));

 app.use("/auth",authcontroller)
   app.use("/cat",catcontroller) //for category module
    app.use("/banner",bannnercontroller) //for banner module
     app.use("/post",postcontroller) //for banner module
    app.use("/story",storycontroller)
 app.use("/user",usercontroller)
 app.use("/profile",profilecontroller)
// app.use("/post",postcontroller)
 app.use("/chat",chatcontroller)
app.use("/cart",cartcontroller)
 startDeleteExpiredStoriesJob()
// app.all("*",(req,res,next)=>{res.status(404).json({message:"in-valid routing"})})

app.use(globalhandlingerror)
await checkDBConnection()
await syncDBConnection();
}
export default bootstrap