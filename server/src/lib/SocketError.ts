import { Socket } from "socket.io";

export function SocketError(
  socket: Socket,
  name: string,
  message: string,
  error?: string | object,
) {
  return socket.emit(name, {
    status: false,
    message,
    error,
  });
}
