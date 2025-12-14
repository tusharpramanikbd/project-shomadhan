import nodemailer from 'nodemailer';
import 'dotenv/config';
import { TMailOptions, TNodeError } from 'src/types/email.types.ts';
import { MessageCodes } from 'src/constants/messageCodes.constants.ts';
import { InternalServerError } from 'src/errors/index.ts';

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

export const sendEmail = async (options: TMailOptions): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      'Email credentials (EMAIL_USER, EMAIL_PASS) are not configured in .env'
    );

    throw new InternalServerError(
      MessageCodes.EMAIL_SERVICE_NOT_CONFIGURED,
      'Email service is not configured properly.'
    );
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
    const err = error as TNodeError;

    // SMTP connection issue
    if (err.code === 'ECONNREFUSED') {
      throw new InternalServerError(
        MessageCodes.EMAIL_SERVICE_NOT_CONFIGURED,
        'Email service is not configured properly.'
      );
    }

    // Fallback unknown email failure
    throw new InternalServerError(
      MessageCodes.EMAIL_UNKNOWN_ERROR,
      'Failed to send OTP email due to an unknown error.'
    );
  }
};
