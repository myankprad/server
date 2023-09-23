const mongoose = require("mongoose")
require("dotenv").config()

exports.connect = () =>{
    mongoose.connect(process.env.MONGO_URL, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
    })
    .then(()=> console.log("DB connected successfully"))
    .catch((err)=> {console.log("Error in connnecting DB", err);
                    process.exit(1)
})
}