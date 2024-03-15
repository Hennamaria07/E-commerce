const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        image: {
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

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
