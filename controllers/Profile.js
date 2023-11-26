const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {

    try {
        // get data
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        // get user id
        const id = req.user.id;
        // validation 
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });

        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success: true,
            message: 'Profile Updated Successfully',
            profileDetails,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to Update Profile',
        });
    }
}

// delete Account 

exports.deleteAccount = async (req, res) => {

    try {

        // get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });

        }
        // delete Profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        // HW enroll user from all unerolled courses
        // await enrollUserInAllCourses(id);
        // delete User 
        await User.findByIdAndDelete({ _id: id });
        // return response
        return res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to Delete User',
        });
    }

}

// get all user Details

exports.getAllUserDetails = async (req, res) => {

    try {

        //get id
        const id = req.user.id;
        //Validation  and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response 
        return res.status(200).json({
            success: true,
            message: 'User Data fetched Successfully',
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to get all User Details',
        });
    }
}