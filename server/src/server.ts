import app from "./app";
import { PORT } from "./config/env/app.env";
import { logger } from "./config/logger";
import prisma from "./config/prisma";
import * as http from "node:http";
import { connectToServer } from "./socket";

const server = http.createServer(app);

prisma.$connect().then(() => {
  logger.info("DB Connected");
});

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

const io = connectToServer(server);

export { io };
