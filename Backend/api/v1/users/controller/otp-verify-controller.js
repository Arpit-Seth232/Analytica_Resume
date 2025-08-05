const { otpModel } = require("../model/otp-model");

const otpVerificationController = async(req,res)=>{

    try{

    const {email,otp} = req.body;

    const result = await otpModel.findOne({email : email});

    if(result != null){
        
        if(result.otp == otp){

            res.status(200);
            res.json({
                isOtpVerified : true,
                message : 'otp verfication successfull'
            })
        }

        else{

            res.status(400);
            res.json({
                isOtpVerified : false,
                message : 'entered the wrong otp'
            })
        }
        

    }

    else{

        res.status(500);
        res.json({
            isOtpVerified : false,
            message : `can't find the user with particular email, try after sometime`
        })
    }

}

catch(err){
    res.status(500);
    
    res.json({
        isOtpVerified : false,
        message : err.message
    })
    
}
}

module.exports = {
    otpVerificationController
}