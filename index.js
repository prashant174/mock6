const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {connection}=require("./config/db")
const {UserModel}=require("./model/user.model")
const cors=require("cors")

const {authenticate}=require("./authentication/authentication")
const {profileRouter}=require("./routes/profile.route")

const app=express()
app.use(express.json())
require("dotenv").config()
app.use(cors({
    origin:"*"
}))


app.get("/test",(req,res)=>{
    res.send({"msg":"hello"})
})
app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    const userAlreadyPresent=await UserModel.findOne({email})
    if(userAlreadyPresent){
        res.status(200).send({"msg":"user already present"})
    }
    else{
        try{
            bcrypt.hash(password,10,async function(err,hash){
                const user=new UserModel({name,email,password:hash})
                await user.save()
                res.status(201).send({"msg":"user register successfull"})
            })


        }catch(err){
            res.status(501).send({"msg":"something went wrong"})
        }
    }
   

})


app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
       const user=await UserModel.find({email})
       if(user.length>0){
        const hashedPassword=user[0].password
        bcrypt.compare(password,hashedPassword, function(err,result){
            if(result){
                const token=jwt.sign({"userId":user[0]._id},"hush")
                res.status(201).send({"msg":"login successfull", "token":token})
            }else{
               res.status(200).send({"msg":"login failed"})
            }
        })

       }else{
        res.status(200).send({"msg":"Login failed"})
       }

    }catch(err){
        res.status(501).send({"msg":"something went wrong"})
    }
})


app.use(authenticate)
app.use("/getprofile",profileRouter)

const port=process.env.PORT ||8000
app.listen(port,async()=>{
    try{
        await connection
        console.log("connected to mongodb")
            }
            catch(err){
                console.log(err)
            }
    console.log(`server running on port ${port}`)
})