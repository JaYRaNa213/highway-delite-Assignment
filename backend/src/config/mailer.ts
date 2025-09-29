// import nodemailer from 'nodemailer';

// export const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST!,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER!,
//     pass: process.env.EMAIL_PASS!,
//   },
// });

// transporter.verify()
//   .then(() => console.log('✅ SMTP connected'))
//   .catch(err => console.error('❌ SMTP error:', err));
// // 



import nodemailer from 'nodemailer';

// Hardcoded SMTP configuration
export const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // TLS for 587
  auth: {
    user: '98134c002@smtp-brevo.com', // your Brevo SMTP login
    pass: 'xsmtpsib-43eeaa6f50d1a7d4665f9f51018b000f34003f074a4327a48b630022d413422d-ILvZ73fdkhX5n6RE', // your SMTP key
  },
});

// Optional: verify connection at startup
transporter.verify()
  .then(() => console.log('✅ SMTP connected'))
  .catch(err => console.error('❌ SMTP error:', err));
