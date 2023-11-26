const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const uploadImageToCloudinary = require("../utils/imageUploader");

// Create Subsection

exports.createSubsection = async (req, res) => {

    try {
        // Fetch data from request body
        const { sectionId, title, timeDuration, description } = req.body;
        // Extract file/Video
        const video = req.files.videoFile;

        // Validation!section
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // Create a subsection
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update Section with this subsection ObjectId
        const updateSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    SubSection: SubSectionDetails._id,
                },
            },
            { new: true } // Ensure that the updated document is returned
        ).populate('SubSection'); // Populate the SubSection field

        // Log the updated section
        console.log('Updated Section:', updateSection);

        // Return Response 
        return res.status(200).json({
            success: true,
            message: 'Sub Section Created Successfully',
            updateSection,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to create Sub-Section',
        });
    }
};




// Update Subsection
exports.updateSubsection = async (req, res) => {
    try {
        const { subsectionId, title, timeDuration, description } = req.body;

        // Validation
        if (!subsectionId || (!title && !timeDuration && !description)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request. Please provide valid subsectionId and at least one field to update.',
            });
        }

        // Find and update subsection
        const updatedSubsection = await SubSection.findByIdAndUpdate(
            subsectionId,
            {
                $set: {
                    title: title || undefined,
                    timeDuration: timeDuration || undefined,
                    description: description || undefined,
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedSubsection) {
            return res.status(404).json({
                success: false,
                message: 'Subsection not found.',
            });
        }

        // Return Response
        return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully',
            updatedSubsection,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to update Subsection',
        });
    }
};

// Delete Subsection
exports.deleteSubsection = async (req, res) => {
    try {
        const { subsectionId } = req.params;

        // Validation
        if (!subsectionId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request. Please provide valid subsectionId.',
            });
        }

        // Find and delete subsection
        const deletedSubsection = await SubSection.findByIdAndDelete(subsectionId);

        if (!deletedSubsection) {
            return res.status(404).json({
                success: false,
                message: 'Subsection not found.',
            });
        }

        // Remove reference from Section
        await Section.updateOne(
            { SubSection: subsectionId },
            { $pull: { SubSection: subsectionId } }
        );

        // Return Response
        return res.status(200).json({
            success: true,
            message: 'Subsection deleted successfully',
            deletedSubsection,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete Subsection',
        });
    }
};
