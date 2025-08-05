const express = require('express');
const { registerController } = require('../controller/register-controller');
const { loginController } = require('../controller/login-controller');
const { otpVerificationController } = require('../controller/otp-verify-controller');
const { passwordController } = require('../controller/password-controller');

const userRoute = express.Router();

userRoute.post('/login',loginController);
userRoute.post('/register',registerController);
userRoute.post('/register/otpVerification',otpVerificationController);
userRoute.post('/register/passwordCreation',passwordController);


module.exports={
    userRoute
}