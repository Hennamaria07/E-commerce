const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true
        },
        iconImage: {
            publicId: {
                type: String
            },
            url: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
