const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'michaelnorward777@gmail.com', // replace with your email address
        pass: 'dxhkclqekzjaaxcz' // replace with your email password or app-specific password
    }
});
//dxhkclqekzjaaxcz
// setup email data with unicode symbols
let mailOptions = {
    from: '"Michael Norward" <michaelnorward777@gmail.com>', // sender address
    to: 'cool.story.bro.yasuo@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Test Email', // plain text body
    html: '<b>Hello there, Michael Norward! This email is from node js</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: %s', info.messageId);
    }
});