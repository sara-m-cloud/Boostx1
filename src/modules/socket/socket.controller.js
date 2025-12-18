
import { Server } from "socket.io";
import { joinChat, logoutscoket, registerscoket } from "./services/socket.service.js";
import { sendMessages } from "../chat/services/message.service.js";



export const runIo=(httpserver)=>{
  
     const io=new Server(httpserver,{cors:"*"})
     io.on("connection",async(socket)=>{
         console.log(socket.id);
        await registerscoket(socket)
      await joinChat(socket)
       await sendMessages(io, socket);
         await logoutscoket(socket)
    
     })
    
}
