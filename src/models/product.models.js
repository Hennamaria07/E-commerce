const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [
      {
        publicId: {
          type: String,
          trim: true,
          required: true
        },
        url: {
          type: String,
          trim: true,
          required: true
        }
      }
    ],
    brand: {
      type: String,
      default: ""
    },
    actualPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    stock: {
      type: Number,
      require: true,
      min: 0,
      max: 255
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    size: {
      type: Object,
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      default: 1
    },
    // reviews: [
    //   {
    //     name: {
    //       type: String,
    //       required: true
    //     },
    //     rating: {
    //       type: Number,
    //       required: true
    //     },
    //     Comment: {
    //       type: String,
    //       required: true
    //     }
    //   }
    // ],
    rating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;