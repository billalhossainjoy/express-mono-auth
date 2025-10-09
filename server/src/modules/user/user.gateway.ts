import type { Server, Socket } from "socket.io";
import { UserGatewayHandler } from "./user.handler";

export const RegisterUserSocket = (io: Server, socket: Socket) => {
  socket.on("user", (data) =>
    UserGatewayHandler.registerLocation(socket, "USER", data),
  );

  socket.on("disconnect", () =>
    UserGatewayHandler.removeLocation(socket.data.userId),
  );
};
