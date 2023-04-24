const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.MAIL_PORT,
    secure: process.env.SECURE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const sendMail = async ( to, subject,text,userId)=> {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: to,
        subject: subject,
        text: text + `http://localhost:3000/user/${userId}/verification/`+process.env.VERIFICATION_TOKEN,
      };
      await transporter.sendMail(mailOptions);
}
  
module.exports = {
    sendMail
}