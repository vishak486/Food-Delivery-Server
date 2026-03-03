const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.registerController=async(req,res)=>{
    console.log('inside registerController');
    const{name,email,password}=req.body
    try
    {
        const existingUser= await User.findOne({email})
        if(existingUser)
        {
            res.status(406).json('Already Registered user...Please login')
        }
        else
        {
            const hashedPassword=await bcrypt.hash(password,10)
            const newUser= new User({
                name,email,password:hashedPassword,role:'customer'
            })
            await newUser.save()
            res.status(200).json("Register Successfull")
        }
    }
    catch(err)
    {
        res.status(401).json(err)
    }
    
}

exports.loginController=async(req,res)=>{
    console.log("Inside loginController");
    const{email,password}=req.body
    try
    {
        const existingUser=await User.findOne({email})
        if (!existingUser) {
            return res.status(401).json("Invalid Email or Password")
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
         if (!isMatch) {
            return res.status(401).json("Invalid Email or Password")
        }
        if (existingUser.isBlocked) {
            return res.status(403).json("Account is blocked")
        }
         const token=jwt.sign({userId:existingUser._id,role:existingUser.role},process.env.JWTPASSWORD,{ expiresIn: '1d' })
         console.log(token);
         res.status(200).json({
            user:{
                _id:existingUser._id,
                name:existingUser.name,
                email:existingUser.email,
                role:existingUser.role
            },
            token
         })     
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json("Server Error")
    }
}