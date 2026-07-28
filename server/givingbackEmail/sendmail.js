const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

async function sendGivingBackEmail(toEmail) {
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "api",
      pass: "32d02625b4189744bdd2f10c11de2c31",
    },
  });

  let htmlTemplate = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf8"
  );

  htmlTemplate = htmlTemplate
    .replace(/\.\/logo\.png/g, "cid:logo")
    .replace(/\.\/g\.png/g, "cid:heroImage")
    .replace(/\.\/Social\.png/g, "cid:socialImage")
    .replace(/\.\/linkedin\.png/g, "cid:linkedin")
    .replace(/\.\/insta\.png/g, "cid:insta")
    .replace(/\.\/fb\.png/g, "cid:facebook");

  const mailOptions = {
    from: '"GivingBack NG" <info@givingbackng.org>',
    to: toEmail,
    subject: "Join 1,000+ Verified NGOs | Stand a Chance to Win ₦300,000!",
    html: htmlTemplate,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "logo.png"),
        cid: "logo",
      },
      {
        filename: "g.png",
        path: path.join(__dirname, "g.png"),
        cid: "heroImage",
      },
      {
        filename: "Social.png",
        path: path.join(__dirname, "Social.png"),
        cid: "socialImage",
      },
      {
        filename: "linkedin.png",
        path: path.join(__dirname, "linkedin.png"),
        cid: "linkedin",
      },
      {
        filename: "insta.png",
        path: path.join(__dirname, "insta.png"),
        cid: "insta",
      },
      {
        filename: "fb.png",
        path: path.join(__dirname, "fb.png"),
        cid: "facebook",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

sendGivingBackEmail("lekelolu@gmail.com");
