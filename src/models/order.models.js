const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.OrderId,
      ref: 'Product',
      required: true 
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    productPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'CANCELLED', 'DELIVERED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
