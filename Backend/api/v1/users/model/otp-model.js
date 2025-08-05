const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
        trim : true
    },

    otp : {
        type:String,
        required : true,
        trim : true
    }

},{
    timestamps: true
})

const otpModel = mongoose.model('otp',otpSchema);

module.exports = {
    otpModel
}