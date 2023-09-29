const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


// send otp

exports.sendOTP = async(req, res)=>{
    
       try {
         // fetch email
         const {email} = req.body;
         const checkUserPresent = await User.findOne({email});
         if(checkUserPresent){
             return res.status(401).json({
                 success: false,
                 message: "User already exist"
             })
         }
 
         // generate otp

         var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
         });
         console.log("Otp generate", otp)
        //   check valid otp or not 
         result = await OTP.findOne({otp: otp});

         while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
         });
         result = await OTP.findOne({otp: otp});
        }
        const otpPayload = {email, otp}
        // create an entry in db for otp

        const otpBody = await OTP.create(otpBody)
        console.log(otpBody)

        // return response success
        res.status(200).json({
            success: true,
            message: "OTP send successfully",
            otp
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
       }
}


// signup

exports.signUp = async(req, res)=>{
   try {
     // data fetch
     
     const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body;

    // validate

    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success: false,
            message: "All fields are required"
        })
    }

    // password match

    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message:"Password and ConfirmPassword are not match"
        })
    }

    // already exist or not

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User is already registered"
        })
    }

    // find most recent otp

    const recentOtp  = await OTP.find({email}).sort({createdAt: - 1}).limit(1) 
    console.log(recentOtp)
    // validate otp
    if(recentOtp.length == 0){
        return res.status(400).json({
            success: false,
            message: "OTP found"
        })
    } else if(otp !== recentOtp ){
        // invalid otp
        return res.status(400).json({
            success: false,
            message:"Invalid otp"
        })
    }
    
    // hash password

    const hashedPassword = await bcrypt.hash(password, 10)

    
    // entry in db

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    })
     
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    // res return 
    return res.status(200).json({
        success:true,
        message:"User is registered successfully",
        user,
    })
   } catch (error) {
    console.log(error),
        res.status(500).json({
        success:false,
        message: "user can not be registered",

    })
   }
}

// login

exports.login = async(req, res)=>{
    try {
        // get data from body

        const {email, password} = req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message: "All fields are required, please try again",
            })
        }

        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message: "User is not registered, please sign in"
            })
        }

        // generate token after check password

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h", 
            }) 
            user.token = token;
            user.password = undefined;  
            
              // create cookie and send response

        const options ={
            expires: new Date(Date.now() + 3*34*60*60*1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Login successfully"
        })
        } else{
            return res.status(401).json({
                success: false,
                message: "Password did not matched"
            })
        }

      
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: "Login failure, please try again"
        })
    }
}

// change password

exports.changePassword = async(req, res)=>{
    // get data from body

    // get oldpassword newpassword confirmnewpassword

    // validation

    // update pwd in db

    // send mail password updated

    // return response
}