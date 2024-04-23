const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: [true, "Fullname is required"]
        },
        phone: {
            type: Number,
            required: [true, "Phone number is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        image: {
            publicId: {
                type: String,
                trim: true,
                required: true
            },
            avatar: {
                type: String,
                trim: true,
                required: true
            }
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'seller'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, "Email is required"]
        },
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    console.log("env----->", process.env);
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

module.exports = User;