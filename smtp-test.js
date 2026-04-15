import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "contact@mpintellect.com",
    pass: "/,KQF2%@ntgc.Kx",
  },
  logger: true,
  debug: true,
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: '"MPIntellect Test" <contact@mpintellect.com>',
      to: "abdrahman.mez7@gmail.com", // use Gmail/Yahoo/Outlook for test
      subject: "SMTP Test",
      text: "If you see this, Namecheap SMTP works.",
    });
    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();