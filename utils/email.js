const nodemailer = require("nodemailer");

const sendEmail = async options => {
    //create a transporter
    let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        //define the email options
    let mailOptions = {
        from: "Semih Berkay <hello@semih.io>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    //actually send the email
    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;