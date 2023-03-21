const express=require("express")
const {ProfileModel}=require("../model/profile.model")

const profileRouter=express.Router()

profileRouter.get("/profile",(req,res)=>{
    res.send("hello prashant")
})

module.exports={profileRouter}