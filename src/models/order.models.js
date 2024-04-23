const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true 
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: [
      { price: {
        type: Number,
        required: true,
      },
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
      },
      quantity: {
        type: Number,
        required: true,
      },}
    ],
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['PENDING', 'SHIPPING', 'CANCELLED', 'DELIVERED'],
      default: 'PENDING'
    },
    date: {
      type: Date,
      default: Date.now()
    },
    paidAt: {
      type: Date,
      required: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveredAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
