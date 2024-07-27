const nodemailer = require('nodemailer');
const generateOTP = require('../controller/optfile');
exports.sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lee98@ethereal.email',
            pass: 'DZgSKWFR9kFKghpeTx'
        }
    });
    const otp = generateOTP(); // Generate OTP
    console.log('Generated OTP:', otp); 
    const mailOptions = {
        from: 'Anushka <lee98@ethereal.email>',
        to: to,
        subject: subject,
        text: text,
        html:  `<h1>Your OTP Code</h1><p>Your OTP code is <b>${otp}</b>.</p>` 
        //'<b><h1><i>Hello world</i></h1></b>'
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { info, otp }; 
    } catch (error) {
        console.log('Error sending email:', error);
        throw error;
    }

}   