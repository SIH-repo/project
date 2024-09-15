const nodemailer = require('nodemailer');

require('dotenv').config();

async function sendEmail(userEmail,subject,text) {

    let transporter = nodemailer.createTransport({
    
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    let mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject,
        text: text
    };
 
     transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("failed",error)
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = sendEmail;