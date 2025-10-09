export const SocketMap = new Map<string, Set<string>>();

export class UserSocketMap {
  static addSocket = async (userId: string, socketId: string) => {
    if (!SocketMap.has(userId)) SocketMap.set(userId, new Set());
    SocketMap.get(userId)!.add(socketId);
  };

  static removeSocket = async (userId: string) => {
    const sockets = SocketMap.get(userId);
    if (sockets) {
      SocketMap.delete(userId);
      if (sockets.size === 0) {
        SocketMap.delete(userId);
      }
    }
  };
}
