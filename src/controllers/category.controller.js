const Category = require("../models/category.models.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const mongoose = require('mongoose');

// Create catagory
const CreateCategory = async(req, res) => {
    try {
        const {name} = req.body;
        const iconLocalPath = req.file?.path;
        if(!name) {
            return res.status(400).json({
                success: false,
                message: "Catagory name is required"
            })
        } else {
            const nameLower = name.toLowerCase();
            const icon = await uploadCloudinary(iconLocalPath);
            const catagory = await Category.create({
                name: nameLower,
                iconImage: {
                    publicId: icon.public_id || "",
                    url: icon.url
                }
            });
            return res.status(200).json({
                success: true,
                catagory,
                message: `${nameLower} is added successfully`
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete catagory
const DeleteCategory = async(req, res) => {
    try {
        const id = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get ALL CATAGORIES
const AllCategories = async (req, res) => {
    try {
        const catagories = await Category.find();
        if(!catagories) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            });
        } else {
            return res.status(200).json({
                success: true,
                catagory: catagories,
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// SINGLE CATEGORY
const GetCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // Validate if the categoryId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }
        const category = await Category.findById(categoryId);
        if(!category) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            }); 
        }
            return res.status(200).json({
                success: true,
                category
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CATEGORY
const UpdateCategory = async(req, res) => {
    try {
        const id = req.params.id;
        const {name} = req.body;
        if(!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            })
        }
        const iconLocalPath = req?.file?.path;
        const icon = await uploadCloudinary(iconLocalPath)
        const updatedCategory = await Category.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    iconImage: {
                        publicId: icon?.public_id,
                        url: icon?.url
                    }
                }
            },
            {
                new: true
            }
            );
            if(!updatedCategory) {
                return res.status(500).json({
                    success: false,
                    message: "unable to update"
                })
            }
            return res.status(200).json({
                success: true,
                category: updatedCategory,
                message: "Category updated successfully"
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    CreateCategory,
    DeleteCategory,
    AllCategories,
    GetCategory,
    UpdateCategory
}