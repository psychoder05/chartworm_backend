const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'vikasideiosoft@gmail.com',
    pass: 'oywxlyxezxhdmwgb'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, subject, body) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Medicare.com 👻" <vikasideiosoft@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: body, // html body
  });
}

module.exports = sendMail