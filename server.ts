import { createServer } from "http";
import { Server, Socket } from "socket.io";
import next from "next";
import { updateLastSeen } from "./server-action/leftSidebar";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

type PrivateMessage = {
  senderId: string;
  receiverId: string;
  content: string;
};

const users: Record<string, string> = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Connected:", socket.id);

    socket.on("register_user", (userId: string) => {
      users[userId] = socket.id;
      console.log("Registered:", userId);
    });
socket.emit("online_user",users)
    socket.on("send_private_message", (data: PrivateMessage) => {
      const { senderId, receiverId, content } = data;

      const receiverSocketId = users[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_private_message", {
          id: Date.now().toString(),
          senderId,
          receiverId,
          content,
          seen: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    socket.on("disconnect", () => {
      for (const userId in users) {
        if (users[userId] === socket.id) {
           updateLastSeen(userId, new Date());
          delete users[userId];
          break;
        }
      }

      console.log("Disconnected:", socket.id);
    });
  });

  httpServer.listen(3000, () => {
    console.log("Server running on :3000");
  });
});
