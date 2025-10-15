import express from "express";
import helmet from "helmet";
import cors from "cors";
import { NotFoundHandler } from "./lib/HttpError";
import { DefaultErrorHandler } from "./middleware/ErrorHandler";
import { AuthRouter } from "./modules/auth";
import cookieParser from "cookie-parser";
import { UserRouter } from "./modules/user";
import { AgreementsRouter } from "./modules/aggrements";
import { logger } from "./config/logger";
import { AirlinesRouter } from "./modules/airlines";
import { AssessmentsRouter } from "./modules/assessments";
import { SubmissionRouter } from "./modules/submissions/submission.route";
import { StatisticsRouter } from "./modules/statistics";
import { PaymentRouter } from "./modules/payment";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (_req, res) => {
  logger.info("Server is running");
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/auth", AuthRouter);
app.use("/profile", UserRouter);
app.use("/agreements", AgreementsRouter);
app.use("/airlines", AirlinesRouter);
app.use("/assessments", AssessmentsRouter);
app.use("/submissions", SubmissionRouter);
app.use("/statistics", StatisticsRouter);
app.use("/payment", PaymentRouter);

app.use(NotFoundHandler); // Handle doesn't exist routes
app.use(DefaultErrorHandler); // Default error handler

export default app;
