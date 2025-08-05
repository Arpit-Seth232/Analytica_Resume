
const { otpModel } = require("../model/otp-model");
const { sendOtpMail } = require("../utils/email-handler");

const registerController = async (req,res)=>{

    const {email} = req.body;

    const otp = Math.floor(Math.random()*(9999-1000+1))+1000;

    try{
       await sendOtpMail({email,otp});



        const result = await otpModel.findOneAndUpdate(
            {email : email},
            {$set : {otp : (otp+'')}},
            {new : true}
        )

    if(result == null){
      await otpModel.create({
        email : email,
        otp : (otp+'')
       })

    }

       res.status(201);

       res.json({
        isOtpSent : true,
        message : 'otp sent successfully'
       })

       

    }

    catch(err){
         res.status(500);

       res.json({
        isOtpSent : false,
        message : err.message   
       })
    }

    

    


}

module.exports = {
    registerController
}