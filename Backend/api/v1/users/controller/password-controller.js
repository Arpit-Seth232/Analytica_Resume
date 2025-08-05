const { userModel } = require("../model/user-model");

const passwordController = async (req,res)=>{

    try{

    const {email,pass} = req.body;

    const result = await userModel.findOne({email : email});

    if(result != null){
        res.status(400);
        res.json({
            isUserRegistered : false,
            message : 'user already existed'
        })
    }

    else{
      await userModel.create({
            email : email,
            password : pass
        })

        res.status(201);
        res.json({
            isUserRegistered : true,
            message : 'new user created'
        })
    }

    

    }
    catch (err){
        res.status(500);
        res.json({
            isUserRegistered : false,
            message : err.message
        })
    }

}

module.exports = {
    passwordController
}