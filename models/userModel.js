const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String
    },
    role:{
        type:String,
        enum:['customer','restaurant_admin','admin'],
        default:'customer'
    },
    addresses:[
        {
            street:String,
            city:String,
            state:String,
            pincode:String,
            landmark:String
        }
    ],
    isBlocked:{
        type:Boolean,
        default:false
    }
},{ timestamps: true })

module.exports=mongoose.model('User',userSchema)