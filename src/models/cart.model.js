const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderItems: [
      { 
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }
    ],
    // totalPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0,
    // },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart;
