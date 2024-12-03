import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const io = new Server(server, {
  cors: {
    origin: ["https://chat-mu-lilac.vercel.app"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("usuário conectado", socket.id);
  socket.on("disconnect", (reason) => {
    console.log("usuário desconectado", socket.id);
  });
  socket.on("join", (username) => {
    socket.data.username = username;
  });

  socket.on("message", (message) => {
    console.log(message);
    io.emit('receiveMessage', {
        message,
        authorId:socket.id,
        author:socket.data.username,
        date: new Date()
    })
  });
  
//evento para digitando
  socket.on('typing', ()=> {
socket.broadcast.emit('userTyping', {
    author: socket.data.username,
    authorId:socket.id
})
console.log('usuario digitando')
  })

  //parou de digitar
  socket.on('stopTyping',()=> {
    socket.broadcast.emit('userStopTyping', {
        author: socket.data.username,
        authorId:socket.id
    })
    console.log('usuario parou de digitar')
  })

});
