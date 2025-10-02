import nodemailer from "nodemailer";
import fetch from "node-fetch";

let transporter;

export const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    if (process.env.SMTP_HOST) {
      const tx = getTransporter();
      const info = await tx.sendMail({ from, to, subject, html });
      console.log("✅ SMTP email sent:", info.messageId);
      return info;
    }
  } catch (smtpErr) {
    console.warn("⚠️ SMTP send failed:", smtpErr.message);
  }

  // 🔥 Brevo API fallback
  if (process.env.BREVO_API_KEY) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Makhsoos Store", email: "makhsoos708@gmail.com" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Brevo API failed: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("✅ Brevo API email sent:", data);
    return data;
  }

  throw new Error("Email send failed (no SMTP and no Brevo API).");
};
