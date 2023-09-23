const mongoose = require("mongoose")

const ratingAndReviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: "User",
    },
    rating:{
        type: Number
    },
    review:{
        type: String,
        require: true,
        trim: true,
    },
    contactNumber:{
        type: Number,
        trim: true,
    }
})

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema)