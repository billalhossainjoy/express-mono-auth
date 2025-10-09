interface IMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; path: string }[];
}
