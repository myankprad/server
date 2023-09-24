const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")


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

    
    // entry in db

}

// login

// reset password