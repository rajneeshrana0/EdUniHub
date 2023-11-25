const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const bcrypt = require("brcypt");
const jwt = require("jsonwebtoken");


require("dotenv").config();
// send otp

exports.sendOTP = async (req, res) => {

    try {
        // fetch email from request body
        const { email } = req.body;

        // check email if user alredy exist

        const checkUserPresent = await User.findOne({ email });

        // if User Alredy exist return a Response 

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already Registered ",
            });

        }

        // Generate OTP

        var otp = optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,

        });
        console.log("OTP Generated: ", otp);

        // Make sure OTP is Unique

        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = optGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const optPayload = { email, otp };


        // Create an Entry in DB
        const otpBody = await OTP.create(optPayload);
        console.log(otpBody);

        // return Response Succeasfully

        res.status(200).json({
            success: true,
            message: "Otp Sent Successfully",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                success: false,
                message: error.message,
            }
        )

    }
};



// Sign up

exports.signUp = async (req, res) => {

    try {
        // data fetch from Request body

        const { firstName,
            email,
            lastName,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;


        // Validate Krlo

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {

            return res.status(403).json({
                success: false,
                message: "All Fields are Required",
            });
        }

        // Password Match kro


        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: ' Password and Confirm Password Do not Match , Please Try Again',
            });

        }
        // Check user Already Exist or not

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User Already Registered',
            });

        }


        // find most recent otp Stored for the user 

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        console.log(recentOtp);


        // Validate OTP

        if (recentOtp.length == 0) {

            // otp not found

            return res.status(400).json({
                success: false,
                message: 'Otp Does not Exist in Our record',
            });

        } else if (otp !== recentOtp) {

            // Invalid Otp
            return res.status(403).json({
                success: false,
                message: 'Otp Invalid',
            });

        }

        // Hash Password

        const hassedPassword = await bcrypt.hash(password, 10);

        // Create Entry in DB


        const profileDetails = await profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hassedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,

        })


        // return Response
        return res.stauts(200).json({
            success: true,
            message: 'User Registered Successfully',
            user,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                success: false,
                message: 'User can not be registered please try agin',
            }
        )

    }

};


// Login

exports.login = async (req, res) => {

    try {
        // get data from request body


        const { email, password } = req.body;


        // validation of data

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All Filed Required, Try Again ',
            })

        }
        //user user exist or not

        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'User not registered Please Jump into Sign up',

                }
            )

        }
        //generate JWT Token

        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,

            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;


            // Create Cookie


            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: 'Logged In',
                token,
                user,
            })

        }

        else {
            return res.status(401).json({
                success: false,
                message: ' Password is InCorrect',
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                success: false,
                message: 'Login failures, please try agin',
            }
        )
    }


};




// change Password

exports.changePassword = async (req, res) => {
    try {
        // get data from req body
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }

        // fetch user from database
        const user = await User.findById(req.user.id);

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid old password.',
            });
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match.',
            });
        }

        // Update password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

     
        // sendEmailPasswordUpdated(user.email);
        const emailSubject = 'Password Updated';
        const emailText = 'Your password has been successfully updated.';
        await sendEmailPasswordUpdated(user.email, emailSubject, emailText);


        // return response
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
