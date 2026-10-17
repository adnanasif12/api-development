const nodemailer = require('nodemailer');
const config = require('../config');

const canSend = !!(config.mail.host && config.mail.user && config.mail.pass);
const transport = canSend
  ? nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: { user: config.mail.user, pass: config.mail.pass },
    })
  : null;

// Sends an email. Without SMTP_HOST/USER/PASS (local development) the message is printed to the console instead.
exports.sendMail = async ({ to, subject, text }) => {
  if (!transport) {
    console.log(`[mail:dev] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }
  try {
    await transport.sendMail({ from: config.mail.from, to, subject, text });
  } catch (err) {
    console.error('Failed to send email:', err.message);
    console.log(`[mail:fallback] To: ${to}
Subject: ${subject}
${text}
`); // keep the flow usable if SMTP is misconfigured
  }
};
