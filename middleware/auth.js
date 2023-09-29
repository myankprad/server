const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")


// auth

exports.auth = async (req, res, next)=>{
    try {
        // extract token 

        const token = req.cookie.token || req.body.token || req.header("Authorisation").replace("Bearer ", "")

        // token missing

        if(!token){
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        // verify the token 
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
        } catch (error) {
           return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
            next()
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "something went wrong while validating the token"
        })
    }
} 

// is stu

exports.isStudent = async(req, res, next)=>{
    try {
       
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student only"
            })
        }
        next()

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified please try again"
        })
    }
}

// is ins'

exports.isInstructor = async(req, res, next)=>{
    try {
       
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only"
            })
        }
        next()

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified please try again"
        })
    }
}

// isAdmain


exports.isAdmin = async(req, res, next)=>{
    try {
       
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            })
        }
        next()

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified please try again"
        })
    }
}
