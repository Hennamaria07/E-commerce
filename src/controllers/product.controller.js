const Category = require("../models/category.models.js");
const Product = require("../models/product.models.js");
const { aggregate } = require("../models/user.models.js");
const uploadCloudinary = require("../utils/cloudinary");
const mongoose = require('mongoose');
const removeFromCloudinary = require("../utils/removeCloudinary.js");

// CREATE PRODUCT
const CreateProduct = async(req, res) => {
    try {
        const {name, description, actualPrice, discountPrice, brand, stock, category, size, seller} = req.body;
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
            seller,
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
                message: "Product not fount"
            }); 
        }
        const result = await Product.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(id)
              }
            },
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "seller",
                foreignField: "_id",
                as: "seller"
              }
            },
            {
              "$addFields": {
                "category": { "$arrayElemAt": ["$category", 0] },
                "seller": { "$arrayElemAt": ["$seller", 0] }
              }
            },
            {
              $project: {
                name: 1,
                _id: 1,
                category: "$category.name",
                description: 1,
                brand: 1,
                actualPrice: 1,
                discountPrice: 1,
                size: 1,
                stock: 1,
                images: 1,
                seller: 1
              }
            }
          ]);
          console.log(result);
        return res.status(200).json({
            success: true,
            product: result[0],
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
 }

const UpdateImg = async (req, res) => {
    try {
        const id = req.params.id
        const productImages = req.files;
        if(req.files === "") {
            res.status(400).json({
                success: false,
                message: "Product images are required"
            })
        }
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
                    console.log('images----->', images);
                    const existedProduct = await Product.findById(id);
                   existedProduct.images.map((el) => removeFromCloudinary(el.publicId));
        const product = await Product.findByIdAndUpdate(id, 
        {
            $set: {
                images
            }
        },
        {
            new: true
        }
        )
        return res.status(200).json({
            success: true,
            message: "Product images are updated successfully",
            product
        });
    } catch (error) {
        res.success(500).json({
            success: false,
            message: error.message
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, actualPrice, discountPrice, brand, stock, category, size } = req.body;
        let parsedSize = size;
        if (typeof size === 'string') {
            parsedSize = JSON.parse(size);
        }

        // Validate required fields
        if ([name, description, actualPrice, discountPrice, stock, category, parsedSize].some((field) => !field || field === "")) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    name,
                    description,
                    actualPrice,
                    discountPrice,
                    stock,
                    category,
                    brand,
                    size: parsedSize, // Set size to the parsed size
                    // Remove or define `rating` as necessary
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



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

// product filter by category
const productFilteredByCategory = async (req, res) => {
    try {
        const {categoryId} = req.body;
        if(!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'category id is required'
            })
        }
        const filteredProducts = await Product.find({category: categoryId});
        return res.status(200).json({
            success: true,
            products: filteredProducts,
            message: 'product filtered successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// filter the product based on less price
const productFilteredByPrice = async (req, res) => {
    try {
        const filteredProducts = await Product.find({ discountPrice: { $gt: 0 } }).sort({ discountPrice: -1 }).limit(4);
        return res.status(200).json({
            success: true,
            products: filteredProducts,
            message: 'product filtered successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const BestDeals = async (req, res) => {
    try {
        const product = await Product.aggregate(
            [
                {
                    $addFields: {
                      commonDistance: { $abs: { $subtract: ["$discountPrice", "$actualPrice"] } }
                    }
                  },
                  {
                    $sort: { commonDistance: -1 }
                  },
                  {
                    $limit: 4
                  }
              ]
        )
        if(!product) {
            return res.status(404).json(
                {
                    success: false,
                    message: "no products found"
                }
            )
        }
        return res.status(200).json(
            {
                success: true,
                product
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

const LatestProduct = async (req, res) => {
    try {
        const product = await Product.aggregate(
            [
                {
                    $sort: {
                      createdAt: -1
                    }
                  },
                  {
                    $limit: 4
                  }
              ]
        )
        if(!product) {
            return res.status(404).json(
                {
                    success: false,
                    message: "no products found"
                }
            )
        }
        return res.status(200).json(
            {
                success: true,
                product
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

module.exports = {
    CreateProduct,
    GetAllProducts,
    UpdateProduct,
    GetProduct,
    DeleteProduct,
    productFilteredByCategory,
    productFilteredByPrice,
    UpdateImg,
    BestDeals,
    LatestProduct
}