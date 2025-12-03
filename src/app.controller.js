import { checkDBConnection, syncDBConnection } from "./db/db.connection.js"
import { globalhandlingerror } from "./utils/response/error.response.js"
import authcontroller from "./modules/auth/auth.controller.js"

const bootstrap=async(app,express)=>{
app.use(express.json())
app.get("/",(req,res,next)=>{res.json({message:"welcome in node.js project"})})
 app.use("/auth",authcontroller)
// app.use("/user",usercontrroler)
// app.use("/post",postcontroller)
// app.use("/chat",chatcontroller)


// app.all("*",(req,res,next)=>{res.status(404).json({message:"in-valid routing"})})

app.use(globalhandlingerror)
checkDBConnection()
await syncDBConnection();
}
export default bootstrap