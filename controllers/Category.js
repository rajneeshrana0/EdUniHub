const Category = require("../models/category");


// create handler function for category 

exports.createCategory = async (req, res) => {

    try {

        // fetcch Data From Request Body
        const { name, description } = req.body;

        // Check Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });

        }
        // Create Entry in db

        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });

        console.log(categoryDetails);

        // Return Response

        return res.status(200).json({
            success: true,
            message: 'Category Created Successfully',
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// Get All Category

exports.showAllCategory = async (req, res) => {

    try {

        const allCategory = await Category.find({}, { name: true, description: true });

        return res.status(200).json({
            success: true,
            message: 'All  return category successfully',
            allCategory,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}