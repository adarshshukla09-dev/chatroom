const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket:any) => {
  socket.on("join-room", (roomId:string) => {
    socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, message }:{ roomId:string, message:string }) => {
    io.to(roomId).emit("receive-message", message);
  });
});

httpServer.listen(4000);
