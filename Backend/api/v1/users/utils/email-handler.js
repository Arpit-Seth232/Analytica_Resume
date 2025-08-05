
const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

const transporter = nodemailer.createTransport({
    service:'Gmail',
  host: "smtp.gmail.email",
  port: 587,
  secure: false, 
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASS,
  },
});



const sendEmail = async ({emails,subject,html})=>{

    try{

    const info = await transporter.sendMail({
        from: '"Admin App" <arpit@gmail.com>', // sender address
        to: emails, // list of receivers
        subject: subject, // Subject line
       
        html: html, // html body
      });

    }

    catch(err){
        console.log('---------------------------------------');
        console.log('Could not send email to',emails);
        console.log(err.message);
        console.log('---------------------------------------');

        throw err;
    }
}


const sendOtpMail = async({otp,email})=>{

    await(sendEmail({
        subject : 'otp verfication @ Admin App',
        emails : [email],
        html :
        `
        <html>
        <head>
        <body>

        <div>
        <div style:"padding:2rem">
        <h2> OTP VERIFICATION</h2>
        <p>Your otp for verification is ${otp}</p>
        </div>
        </div>

        </body>
        </head>
        </html>
        `

}))


}


module.exports = {
    sendOtpMail
}