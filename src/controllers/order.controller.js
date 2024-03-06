const Order = require("../models/order.models");
const Product = require("../models/product.models");

const newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;
        if ([shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice].some((field) => !field)) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // const productValid = await Product.findById(orderItems)
        const order = await Order.create(
            {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                customer: req.user._id,
            }
        )
        return res.status(200).json({
            success: true,
            message: "order is placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get Single Order
const GetOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id).populate(
            "customer",
            "fullName email"
        );
        if(!order) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            }); 
        }
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get all Orders -- Admin
const GetAllOrders = async (req, res) => {
    try {
        const order = await Order.find();
        if(!order) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            });
        }
        let totalAmount = 0;
        order.forEach((order) => totalAmount+= order.totalPrice);
            return res.status(200).json({
                success: true,
                totalAmount,
                order,
            })
    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get logged in user  Orders
const myOrders = async(req, res) => {
    try {
        const order = await Order.find({customer: req.user._id})
        if(!order) {
            return res.status(401).json({
                success: false,
                message: "you are not ordered anythink"
            });
        }
        return res.status(200).json({
            success: true,
            order,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
}

// update Order Status -- Admin
const updateOrder = async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid order ID"
        //     });
        // }
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id"
            });
        }

        // Check if trying to set the status to "DELIVERED" when it's already "DELIVERED"
        if (order.status === "DELIVERED" && req.body.status === "DELIVERED") {
            return res.status(400).json({
                success: false,
                message: "You have already delivered this order"
            });
        }

        // Update the order status
        order.status = req.body.status;

        // If setting the status to "DELIVERED", set the deliveredAt timestamp
        if (req.body.status === "DELIVERED") {
            order.deliveredAt = Date.now();
        }

        // order stock update
        order.orderItems.forEach(async (order) => {
            await updateStock(order.productId, order.quantity)
        })
        if (req.body.status === "DELIVERED") {
            order.deliveredAt = Date.now();
          }
          await order.save({validateBeforeSave: false})
        // if (req.body.status === "SHIPPING") {
        //     order.orderItems.forEach(async (o) => {
        //       await updateStock(o.product, o.quantity);
        //     });
        //   }
        return res.status(200).json({
            success: true,
            order,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }); 
    }
}

// Delete order
const DeleteOrder = async(req, res) => {
    try {
        const id = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateStock = async (id, quantity) => {
    try {
        const product = await Product.findById(id);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found with this Id"
            });
        }
        product.stock -= quantity;
        await product.save({validateBeforeSave})
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    GetOrder,
    GetAllOrders,
    newOrder,
    myOrders,
    DeleteOrder,
    updateOrder
}
