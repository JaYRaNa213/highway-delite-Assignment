import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

// SMTP configuration via environment variables
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection at startup (logs only)
transporter
  .verify()
  .then(() => console.log('✅ SMTP connected'))
  .catch((err) => console.error('❌ SMTP error:', err));
