const Category = require("../models/category.models.js");
const Product = require("../models/product.models.js");
const uploadCloudinary = require("../utils/cloudinary");
const mongoose = require('mongoose')

// CREATE PRODUCT
const CreateProduct = async(req, res) => {
    try {
        const {name, description, actualPrice, discountPrice, brand, stock, category, size} = req.body;
        const parsedSize = JSON.parse(size);
            console.log('size--->',parsedSize);
        // console.log(req.body);
        console.log(`files: ${req.files}`);
        const images = [];
        for (let i = 0; i < req.files.length; i++) {
            const img = req.files[i];
            if (img) {
                const serverImg = await uploadCloudinary(img.path);
                images.push({
                    publicId: serverImg.public_id,
                    url: serverImg.url
                });
            }
        }
        if([name, description, actualPrice, stock, category].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        };
       
        
        const product = await Product.create({
            name,
            description,
            actualPrice,
            discountPrice,
            brand,
            stock,
            category,
            images,
            size: parsedSize
        })
        return res.status(200).json({
            success: true,
            message: "product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// GET ALL PRODUCTS
const GetAllProducts = async (req, res) => {
    try {
        const product = await Product.find();
        if(!product) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            });
            
        } else {
            return res.status(200).json({
                success: true,
                product,
                // size :product.size
            })
        }
    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// GET A SINGLE PRODUCT
 const GetProduct = async(req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            }); 
        }
        return res.status(200).json({
            success: true,
            product,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }
// UPDATE PRODUCT
const UpdateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        const {name, description, price, brand, stock, category, size} = req.body;
        // const images = [];
        // for (let i = 0; i < req.files.length; i++) {
        //     const img = req.files[i];
        //     if (img) {
        //         const serverImg = await uploadCloudinary(img.path);
        //         images.push({
        //             publicId: serverImg.public_id,
        //             url: serverImg.url
        //         });
        //     }
        // }
        if([name, description, price, stock, category, size].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        };
        const updatedProduct = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    description,
                    price,
                    stock,
                    category,
                    brand,
                    rating,
                    size,
                    // images
                }
            },
            {
                new: true
            }
            );
            return res.status(200).json({
                success: true,
                message: "product updated successfully",
                updatedProduct
            })
        // console.log(req.user.images);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete Product
const DeleteProduct = async(req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    CreateProduct,
    GetAllProducts,
    UpdateProduct,
    GetProduct,
    DeleteProduct
}