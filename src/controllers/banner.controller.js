const Banner = require("../models/Banner.model.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const mongoose = require('mongoose');

// Create banner
const CreateBanner = async(req, res) => {
    try {
        const bannerLocalPath = req.file?.path;
        if(!bannerLocalPath) {
            return res.status(400).json({
                success: false,
                message: "banner image is required"
            })
        } else {
            const banner = await uploadCloudinary(bannerLocalPath);
            const bannerData = await Banner.create({
                image: {
                    publicId: banner.public_id || "",
                    url: banner.url
                }
            });
            return res.status(200).json({
                success: true,
                banner: bannerData,
                message: `banner is added successfully`
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
const DeleteBanner = async(req, res) => {
    try {
        const id = req.params.id;
        const deletedBanner = await Banner.findByIdAndDelete(id);
        if (!deletedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get ALL BANNERS
const AllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        if(!banners) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            });
        } else {
            return res.status(200).json({
                success: true,
                banner: banners,
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// SINGLE BANNER
const GetBanner = async (req, res) => {
    try {
        const bannerId = req.params.id;
        // Validate if the categoryId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(bannerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid banner ID"
            });
        }
        const banner = await Banner.findById(bannerId);
        if(!banner) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            }); 
        }
            return res.status(200).json({
                success: true,
                banner
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CATEGORY
const UpdateBanner = async(req, res) => {
    try {
        const id = req.params.id;
        const bannerLocalPath = req?.file?.path;
        if(!bannerLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Banner is required"
            })
        }
        const banner = await uploadCloudinary(bannerLocalPath)
        const updatedBanner = await Banner.findByIdAndUpdate(id,
            {
                $set: {
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
            if(!updatedBanner) {
                return res.status(500).json({
                    success: false,
                    message: "unable to update"
                })
            }
            return res.status(200).json({
                success: true,
                banner: updatedBanner,
                message: "Banner updated successfully"
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    CreateBanner,
    DeleteBanner,
    AllBanners,
    GetBanner,
    UpdateBanner
}