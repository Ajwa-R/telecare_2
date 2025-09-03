const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,      // your gmail
    pass: process.env.MAIL_PASS,      // app password (NOT your gmail password)
  },
});

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"TeleCare" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
