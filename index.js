import express from "express"
import path from "node:path"
import bootstrap from "./src/app.controller.js";
import * as dotenv from "dotenv"
 import { runIo } from "./src/modules/socket/socket.controller.js";


dotenv.config({path:path.resolve("./src/config/.env.dev")})
const app=express()
const port=3000
bootstrap(app,express)

const httpserver=app.listen(port,()=>console.log(`Example app running on ${port}`));

  runIo(httpserver)