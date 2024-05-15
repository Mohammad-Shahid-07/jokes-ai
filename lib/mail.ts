"use server";
import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const senderMail = process.env.NODEMAILER_EMAIL;
const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: senderMail,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  const mailOptions = {
    from: senderMail,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log("gelp");
        
        resolve(info);
      }
    });
  });
};

export const sendTwoFactorTokenEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const mailOptions = {
    from: `${email}`,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

export const sendResetEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  const mailOptions = {
    from: senderMail,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
