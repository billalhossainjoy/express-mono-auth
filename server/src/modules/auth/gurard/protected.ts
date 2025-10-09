import { asyncHandler } from "../../../lib/AsyncHandler";
import { JWT } from "../jwt";
import prisma from "../../../config/prisma";

export const Protected = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  const token =
    (authorization && authorization.split(" ")[1]) || req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const user = JWT.verifyAccessToken(token);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const validateUser = await prisma.account.findUnique({
    where: {
      id: user.id,
    },
    include: {
      user: true,
    },
  });
  if (!validateUser) return res.status(401).json({ message: "Unauthorized" });

  req.user = validateUser.user;
  req.account = validateUser;

  next();
});
