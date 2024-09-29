const nodemailer = require('nodemailer');

require('dotenv').config();

async function sendEmail(newAlert,emailList) {

    let transporter = nodemailer.createTransport({
    
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false 
        }
    });
    
   
    const mailOptions = {
        from: process.env.EMAIL,
        to: emailList.join(','),  
        subject: `New Alert in ${newAlert.alertTitle}: ${newAlert.level} (Data: ${newAlert.data})`,
        text: newAlert.description
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