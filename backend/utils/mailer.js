// utils/mailer.js
const nodemailer = require('nodemailer');

function createTransport() {
  // If env missing, return a no-op transport to avoid crashes in dev
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    return {
      sendMail: async (opts) => {
        console.warn('[mailer] MAIL_USER/PASS not set. Pretending to send:', {
          to: opts.to, subject: opts.subject,
        });
        return { accepted: [opts.to], rejected: [] };
      },
    };
  }

  // Gmail (App Password) – most stable with SSL 465
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 465),
    secure: true, // SSL
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // app password, NOT your Gmail login
    },
  });
}

const transporter = createTransport();

async function sendMail({ to, subject, html, fromName = 'TeleCare' }) {
  return transporter.sendMail({
    from: `"${fromName}" <${process.env.MAIL_USER || 'no-reply@telecare.local'}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };

