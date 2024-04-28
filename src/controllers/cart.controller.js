const Cart = require("../models/cart.model");
const mongoose = require("mongoose");

const create = async (req, res) => {
    try {
        const { orderItems, taxPrice, shippingPrice } = req.body;
        const customerId = req.user._id;

        if (!customerId || !orderItems) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if the product already exists in the cart for the current customer
        const existingCart = await Cart.findOne({ customer: customerId });

        if (existingCart) {
            // Check if the product is already in the cart
            const existingItem = existingCart.orderItems.find(item => item.product.toString() === orderItems[0].product.toString());
            if (existingItem) {
                // If the product already exists in the cart, update its quantity
                existingItem.quantity += 1;
                await existingCart.save(); // Save the updated cart
                return res.status(200).json({
                    success: true,
                    message: "Item quantity updated in cart",
                    cartProduct: existingCart
                });
            } else {
                // If the product is not in the cart, add it to the existing cart
                existingCart.orderItems.push({
                    product: orderItems[0].product,
                    quantity: 1
                });
                await existingCart.save(); // Save the updated cart
                return res.status(200).json({
                    success: true,
                    message: "Item added to cart",
                    cartProduct: existingCart
                });
            }
        }

        // If the cart does not exist, create a new cart
        const cartProduct = await Cart.create({
            customer: customerId,
            orderItems,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0
        });
        return res.status(201).json({
            success: true,
            message: "Item added to cart",
            cartProduct
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const allProducts = async (req, res) => {
    try {
        const cartProducts = await Cart.aggregate([
            {
                $match: {
                    customer: new mongoose.Types.ObjectId(req.user?._id) // Replace ObjectId with the actual ID of the document
                }
            },
            {
                $unwind: "$orderItems"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.product",
                    foreignField: "_id",
                    as: "orderItems.product"
                }
            },
            {
                $addFields: {
                    "orderItems.product": { $arrayElemAt: ["$orderItems.product", 0] }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    customer: { $first: "$customer" },
                    orderItems: { $push: "$orderItems" }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            cartItems: cartProducts[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateQuantity = async (req, res) => {
    const {productId, newQuantity } = req.body;
    const customerId = req.user?._id;
    try {
        // Find the document by its ID
        const order = await YourModel.findById(customerId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Iterate over the order items array to find the item with the matching product ID
        const updatedOrderItems = order.orderItems.map(item => {
            if (item.product.toString() === productId) {
                return {
                    ...item,
                    quantity: newQuantity
                };
            }
            return item;
        });

        // Update the order items array with the modified item
        order.orderItems = updatedOrderItems;

        // Save the updated document
        await order.save();

        return res.status(200).json({ 
            success: true,
            message: 'Quantity updated successfully', 
            order });
    } catch (error) {

    }
}
module.exports = {
    create,
    allProducts
};
