const moongoose = require("moongoose");

const OTPSchema = new moongoose.OTPSchema({
    email: {
        type: String,
        required: true,

    },
    otp: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
})

module.exports = models("OTP",OTPSchema);