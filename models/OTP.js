const moongoose = require("moongoose");
const mailSender = require("../utils/mailSender");

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
});


// a function --> to send Email

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email from Campus Crate",
            otp
        );
        console.log("Email Sent Successflly : ", mailResponse);
    } catch (error) {
        console.log("Error Occured while Sending mail : ", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = models("OTP", OTPSchema);
