const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  console.log(options);
  // Create transporter (service that will send emails like Gmail )
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "andreane.von@ethereal.email",
      pass: "3d9AbYeCCHRxh6fPm5",
    },
  });

  // 2) Define the email options (from, to, subject, text/html)
  const mailOptions = {
    from: "E-shop App <moaza2298@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">
          You requested to reset your password. Use the following code:
        </p>
        <div style="background: #f4f6f8; border: 1px dashed #2c3e50; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
          <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">
            ${options.resetCode}
          </span>
        </div>
        <p style="font-size: 14px; color: #555;">
          This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 30px;">
          — The E-shop Team
        </p>
      </div>
    `,
  };

  // 3) send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
