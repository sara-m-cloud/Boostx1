import { authentication, socketConnection } from "../../../middleware/socket/socket.auth.middleware.js";

 export const registerscoket=async(socket)=>{
         const {data,valid}=await authentication({socket})
         console.log(valid);
         
        if(!valid){
          return  socket.emit("socket_Error",data)
        }
    
         socketConnection.set(data.user.uid.toString(),socket.id)
         console.log(socketConnection);
         
       return "DONE"
     }
     export const joinChat = (socket) => {
  socket.on("joinChat", ({ chatId }) => {
    if (!chatId) return;

    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} joined chat_${chatId}`);
  });
};

   export  const logoutscoket=async(socket)=>{
     return socket.on("disconnect",async()=>{
      const {data,valid}=await authentication({socket})
      if(!valid){
        return  socket.emit("socket_Error",data)
      } 
     
       socketConnection.delete(data.user.uid.toString())
       console.log(socketConnection);
       
     return "DONE"
     })
    }