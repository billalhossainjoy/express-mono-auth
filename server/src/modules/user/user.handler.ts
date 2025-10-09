import { Socket } from "socket.io";
import { SocketMap, UserSocketMap } from "./user.map";
import { SocketError } from "../../lib/SocketError";

export class UserGatewayHandler {
  static async registerLocation(socket: Socket, type: "USER", data: any) {
    const id = socket.data.userId;
    try {
      await UserSocketMap.addSocket(id, socket.id);
    } catch (err) {
      console.log(err);
      SocketError(
        socket,
        `${type.toLowerCase()}:error`,
        "Unknown error occurred.",
      );

      await UserSocketMap.removeSocket(id);
    }
  }

  static async removeLocation(id: string) {
    UserSocketMap.removeSocket(id).then(() => console.log(SocketMap));
  }
}
