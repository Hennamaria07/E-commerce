const jwt = require ('jsonwebtoken');
const User = require('../models/user.models.js');
const verifyToken = async (req, res, next) => {
try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
        if(!token) {
            return res.status(401).json({
                success: false,
                message:"Unauthenicated request",
                isAuthenticated: false
            });
        };
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const user = await User.findById(decodedToken?._id);
        if(!user) {
            return res.status(404).json({
                success: false,
                message:"Invalid token",
                isAuthenticated: false
            });
        }
        req.user = user;
        next();
} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
        isAuthenticated: false
    });
}
}

const isSeller = async (req, res, next) => {
    if(req.user.role !== 'seller') {
        return res.status(403).json({
            success: false,
            authorization: false,
            message: "You do not have the permission to perform this action"
        });
    }
    next();
}

const isAdmin = async (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            authorization: false,
            message: "You do not have the permission to perform this action"
        });
    }
    next();
}

const isAdminAndSeller = async (req, res, next) => {
    if(!(req.user.role === 'admin' || req.user.role === 'seller')) {
        return res.status(403).json({
            success: false,
            authorization: false,
            message: "You do not have the permission to perform this action"
        });
    }
    next();
}
module.exports = {
    verifyToken,
    isSeller,
    isAdmin,
    isAdminAndSeller
};