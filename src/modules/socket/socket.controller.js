
import { Server } from "socket.io";
import { joinChat, joinUser, leaveChat, logoutscoket, registerscoket } from "./services/socket.service.js";
import { messagesSeen, sendMessages } from "../chat/services/message.service.js";
// import { Socket } from "socket.io-client";



export const runIo=(httpserver)=>{
  
     const io=new Server(httpserver,{cors:"*"})
     io.on("connection",async(socket)=>{
         console.log(socket.id);
        await registerscoket(socket)
        await joinUser(socket)
      await joinChat(socket)
       await sendMessages(io, socket);
       await messagesSeen(socket)
       await leaveChat(socket)
         await logoutscoket(socket)
    
     })
    
}
