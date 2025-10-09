import { Server } from "socket.io";
import http from "node:http";
import { verifyMiddleware } from "./middleware/verify.middleware";
import { RegisterUserSocket } from "./modules/user/user.gateway";

export function connectToServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH"],
    },
  });

  io.use(verifyMiddleware);

  io.on("connection", (socket) => {
    // Register Socket
    RegisterUserSocket(io, socket);

    socket.on("disconnect", () => {});
  });

  return io;
}
