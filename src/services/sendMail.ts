import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import { envConfig } from "../config/config.ts";

interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const FROM_ADDRESS = `Homify-Ecommerce <${envConfig.email ?? ""}>`;

let transporter: Transporter | null = null;

const getRequiredEnvValue = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required email configuration: ${name}`);
  }

  return value;
};

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const email = getRequiredEnvValue(envConfig.email, "EMAIL");
  const emailPassword = getRequiredEnvValue(
    envConfig.emailPassword,
    "EMAIL_PASSWORD"
  );

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: emailPassword,
    },
  });

  return transporter;
};

const buildMailOptions = ({
  to,
  subject,
  text,
  html,
}: MailPayload): SendMailOptions => {
  if (!to.trim()) {
    throw new Error("Email recipient is required");
  }

  if (!subject.trim()) {
    throw new Error("Email subject is required");
  }

  if (!text.trim() && !html?.trim()) {
    throw new Error("Email body is required");
  }

  return {
    from: FROM_ADDRESS,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  };
};

const sendMail = async (payload: MailPayload) => {
  const mailOptions = buildMailOptions(payload);
  const mailTransporter = getTransporter();

  return mailTransporter.sendMail(mailOptions);
};

export default sendMail;
