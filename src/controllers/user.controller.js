const User = require("../models/user.models.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const bcrypt = require('bcryptjs')

const options = {
    httpOnly: true,
    secure: true
}
const generateToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    console.log(`access token is genreated ${accessToken}`);
    return accessToken
}
const Signup = async (req, res) => {
    try {
        const {fullName, email, password, confirmPassword, phone} = req.body;
        const avatarLocalPath = req.file?.path;
        // console.log(avatarLocalPath);
        if([fullName, email, password, confirmPassword, phone, avatarLocalPath].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        };
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        const existedUser = await User.findOne({email});
        if(existedUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        };
        const avatar = await uploadCloudinary(avatarLocalPath);
        // console.log(avatar.url, avatar.public_id);
        if(!avatar) {
            return res.status(400).json({
                success: false,
                message: "Avatar is required"
            });
        }
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            image: {
                publicId: avatar?.public_id,
                avatar: avatar.url
            },
        })
        const createdUser = await User.findById(user._id).select('-password');
        if(!createdUser) {
            return res.status(500).json({
                success: false,
                message: "Oops! something went wrong while saving the user details in DB!"
            });
        };
        return res.status(200).json({
            success: true,
            message: "User registred successfully",
            user: createdUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // console.log(email, password)
        if([email, password].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        };
        const user = await User.findOne({email})
        // console.log(user);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        };
        const passwordCorrect = await user.isPasswordCorrect(password);
        if(!passwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credential"
            });
        }
        const loggedUser = await User.findById(user._id).select('-password')
        const accessToken = await generateToken(loggedUser._id);
        console.log(accessToken);
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            success: true,
            message: "Loggedin successfully",
            user: loggedUser,
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// FETCH USERS

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if(!users) {
            return res.status(401).json({
                success: false,
                message: "Something went wrong while feching the details"
            });
        } 
        console.log(users)
            return res.status(200).json({
                success: true,
                message: "All users fectched successfully!",
                user: users
            })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// FETCH A SINGLE USER

const GetUser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id).select('-password');
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        } else {
            return res.status(200).json({
                success: true,
                user
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// DELETE A USER
const DeleteUser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findByIdAndDelete(id);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Account deleted successfully"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE A USER

const UpdateUser = async (req, res) => {
    try {
        // Ensure the required fields are present in the request body
        const { fullName, email, phone, role } = req.body;
        // console.log(avatarLocalPath)
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Get the user ID from the authenticated user object
        const userId = req.user._id;

        // Find and update the user
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    fullName,
                    email,
                    phone,
                    role
                }
            },
            {
                new: true // Return the updated user object
            }
        ).select('-password');

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // User updated successfully
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE PASSWORD

const UpdatePassword = async (req, res) => {
    try {
        const id = req.user._id
        const {password, newpassword, confirmPassword} = req.body;
        if([password, newpassword, confirmPassword].some((field) => !field || field?.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        } else {
            const user = await User.findById(id);
            const passwordCorrect = await user.isPasswordCorrect(password);
            console.log(passwordCorrect);
            if(!passwordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }
            if(newpassword !== confirmPassword) {
                return res.status(401).json({
                    success: false,
                    message: "new password and confirm password doesn't match"
                });
            };
            const hashedNewPassword = await bcrypt.hash(newpassword, 7);
            const updatedUser = await User.findByIdAndUpdate(id, 
                {
                    $set: {
                        password: hashedNewPassword
                    }
                },
                {
                    new: true
                }
                );
            if(!updatedUser) {
                return res.status(401).json({
                    success: true,
                    message: "unable to change the password"
                })
            }
        return res.status(200).json({
            success: true,
            message: "password changed successfully",
            updatedUser
        })
        };
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    Signup,
    login,
    GetAllUsers,
    GetUser,
    DeleteUser,
    UpdateUser,
    UpdatePassword
}