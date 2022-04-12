import * as nodemailer from 'nodemailer'
import * as config from "config/config.json"

// async..await is not allowed in global scope, must use a wrapper
export const main = async (email: string, link: string) => {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = await nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "apikey", // generated ethereal user
      pass: config.email.secretKey, // generated ethereal password
    },
  });

  console.log('email vef', email)
  if(email) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'baimurzinrafael02@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Confirm email", // Subject line
        html: `<b>Hello!</b> <a href="${link}">confirm email</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }
}