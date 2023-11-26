const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        // Data Fetch 
        const { sectionName, courseId } = req.body;

        // Data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        // Create Section
        const newSection = await Section.create({ sectionName });

        // Update course with section object
        const updateCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true },
        ).populate('courseContent'); // Use populate to replace section/sub-sections in the updateCourse details

        // Return response
        return res.status(200).json({
            success: true,
            message: 'Section Created Successfully',
            updateCourseDetails,
        });
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to create Section',
        });
    }
}


// update section

exports.updateSection = async (req, res) => {

    try {

        // data input

        const { sectionName, sectionId } = req.body;

        // data validation

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        //update data

        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        // return response
        return res.status(200).json({
            success: true,
            message: 'Section Updated Successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update Section',
        });
    }
}

exports.deleteSection = async (req, res) => {

    try {

        //get ID
        const {sectionId} = req.body;
        // use find by id and delete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:'Section Deleted Successfully',
        })
        
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to Delete Section',
        });
        
    }
}