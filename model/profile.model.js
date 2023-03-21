const mongoose=require("mongoose")
const profileSchema=mongoose.Schema({
  
     
       profilePic:String,
       name:String,
       bio:String,
       phone:Number,
       email:String,
       password:String
     
})

const ProfileModel=mongoose.model("profile",profileSchema)

module.exports={ProfileModel}