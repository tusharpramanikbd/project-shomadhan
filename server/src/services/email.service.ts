import nodemailer from 'nodemailer';
import 'dotenv/config';
import { TMailOptions } from 'src/types/email.type.ts';

// Creating a Nodemailer transporter using environment variables
// This transporter configuration is specific to Gmail.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options: TMailOptions): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      'Email credentials (EMAIL_USER, EMAIL_PASS) are not configured in .env'
    );

    throw new Error('Email service is not configured properly.');
  }

  const mailData = {
    from:
      process.env.EMAIL_FROM ||
      `"Project Shomadhan" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailData);
    console.log('Email sent successfully: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);

    throw new Error(
      `Failed to send email. Error: ${error instanceof Error ? error.message : 'Unknown email error'}`
    );
  }
};

export { sendEmail };
