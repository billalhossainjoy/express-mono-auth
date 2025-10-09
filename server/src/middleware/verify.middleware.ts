import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../modules/auth/config/auth.config";
import prisma from "../config/prisma";

export const verifyMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const token = socket.handshake.headers["authorization"]?.split(" ")[1]; // Get token from 'Authorization: Bearer <token>'

    if (!token)
      return next({ name: "authorization", message: "No token provided" });

    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
    if (!decoded)
      return next({ name: "authorization", message: "No token provided" });

    const user = await prisma.account.findFirst({
      where: { id: decoded.id },
    });

    if (!user) return next({ name: "authorization", message: "unauthorized" });

    socket.data.userId = user.userId;

    next();
  } catch (err) {
    console.log(err);
    next({ name: "authorization", message: "No token provided" });
  }
};
