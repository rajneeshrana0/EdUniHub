const Tag = require("../models/tags");


// create handler function for tag 

exports.createTag = async(req,res) =>{

    try {

        // fetcch Data From Request Body
        const {name,description} = req.body;

        // Check Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message:'All fields are required',
            });
            
        }
        // Create Entry in db

        const tagDetails = await Tag.create({
            name:name,
            description:description,
        });

        console.log(tagDetails);

        // Return Response

        return res.status(200).json({
            success:true,
            message:'Tag Created Successfully',
        });


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


// Get All Tags

exports.showAllTags =  async(req,res) =>{

    try {

        const allTags = await Tag.find({},{name:true, description:true});

        return res.status(200).json({
            success:true,
            message: 'All tags return tags successfully',
            allTags,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}