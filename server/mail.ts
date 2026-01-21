import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendFeedbackMail(
  name: string,
  email: string,
  message: string
) {
  await mailer.sendMail({
    from: `"UniLib Feedback" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: "New Library Feedback",
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
  });
}
