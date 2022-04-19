require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    },
    ool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
});

exports.sendMail = async (email, message, subject) => {
    try {
        // send mail with defined transport object
        let mailOptions = {
            from: process.env.EMAIL_FROM, // sender address
            to: `${email}`, // list of receivers
            subject: subject, // Subject line
            text: "Event Social", // plain text body
            html: message, // html body
        };
        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err, "Error Sending mail");

            } else {
                console.log(info, "Email Sent succesfully");
            }
        })
    } catch (error) {
        console.error(error);
    }
}

