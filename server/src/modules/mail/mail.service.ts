import nodemailer from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
} from "./config/env.config";
import { logger } from "../../config/logger";
import { HttpError } from "../../lib/HttpError";

export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.transporter
      .verify()
      .then(() => logger.info("Server is ready to take messages"))
      .catch((error) => logger.error("Mail server connection error:", error));
  }

  async sendMail(options: IMailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: MAIL_USER,
        ...options,
      });
    } catch (err) {
      console.log("Error sending email: ", err);
      throw new HttpError(500, "Email sending failed.");
    }
  }
}