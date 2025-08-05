const { userModel } = require("../model/user-model");

const loginController = async(req,res)=>{

    try {

        const {email,pass} = req.body;

        const result = await userModel.findOne({email : email});

        if(result == null){
            res.status(400);
            res.json({
                isLoginSuccessful : false,
                message : 'user not existed, please register to continue'
            })
        }

        else{

            if(result.password == pass){
                res.status(200);
                res.json({
                    isLoginSuccessful : true,
                    message : `welcome back ! ${email}`
                })
            }

            else{
                res.status(400);
                res.json({
                    isLoginSuccessful: false,
                    message : 'login unsuccessful ! wrong password entered'
                })
            }
        }

    }
    catch(err){
        res.status(500);
        res.json({
            isLoginSuccessful : false,
            message : err.message 
        })
    }
}

module.exports = {
    loginController
}