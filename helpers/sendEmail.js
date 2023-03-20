const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_KEY)

const sendEmail = async (data) => {
    const email = {...data, from: "ihor.kozhemyakin@gmail.com"}
    await sgMail.send(email);
}
  
  module.exports = sendEmail;