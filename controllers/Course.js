const Course = require("../models/Course");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const category = require("../models/category");


// create Course handler Function 

exports.createCourse = async (req, res) => {
    try {

        // get all Data
        const { courseName, courseDescription, whatYouWillLearn, price, ategory } = req.body;

        // get thumbnail

        const thumbnail = req.files.thumbnailImage;

        // Validation

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {

            return res.status(400).json({
                success: false,
                message: 'All fileds are required',
            });

        }

        // Check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);

        // Details not found

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not Found',
            });

        }

        // check given Category is valid or not

        const categoryDetails = await Category.findById(category);

        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: 'Category Details not Found',
            });
        }

        // Upload Image to Cloudinary 

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create an Entry in Database

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // add the new Course to the user Schema of Instructor

        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        // update the Category ka schema 

        // TODO -Hw


        // update the Category schema 
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $inc: {
                    courseCount: 1,
                }
            },
            { new: true },
        );

        // Return Response

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed To Create Course',
            error: error.message,
        });
    }
}




// getAll Courses handler Function


exports.showAllCourses = async (req, res) => {

    try {

        // todo change the below statemnet incremently

        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: 'Data for all courses fetched Successfully',
            data: allCourses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed To get All Course',
            error: error.message,
        });
    }
}