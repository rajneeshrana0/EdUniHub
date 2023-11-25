const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("brcypt");
// Reset Password Token


exports.resetPasswordToken = async (res, req) => {

    try {
        // get email from requeest Body

        const email = req.body.email;


        // check user for this email, Email validation 

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Your email not registered with us ',
            })

        }

        // generate Token

        const token = crypto.randomUUID();
        console.log(uuid);


        // update user by adding token and expiration time 

        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true });


        // create Url
        const url = `http://localhost:3000/update-password/${token}`


        // Send Email Containg the url 

        await mailSender(email, "Password reset link",
            `Password Reset Link: ${url}`)
        // return Response

        return res.json({
            success: true,
            message: 'Email sent Successfully, Please Check mail and Change Password'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Womething went wrong while Sending reset password Mail'
        })
    }


}

// Reset Password

exports.resetPassword = async (req, res) => {
    try {
        // Data fetch

        const { password, confirmPassword, token } = req.body;

        // validation 

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Password not Matching',
            });
        }
        //get userDeatils from db using token 
        const userDetails = await user.findOne({ token: token });

        // if no entry Found invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is Invalid',
            });

        }
        // token time check

        if (userDetails.resetPasswordExpires > Date.now() ) {
            
            return res.json({
                success:false,
                message: 'Token is Expired, Please regenerate Token',
            });
        }
        // hash password
const hashedPassword = await bcrypt.hash(password,10);

        // password update
        await User.findOneAndUpdate(

            {token:token},
            {password:hashedPassword},
            {new:true},

        );

        // return response

        return res.status(200).json({
            success:true,
            message:'Password reset Successfull',
        })

    } catch (error) {

    }
}