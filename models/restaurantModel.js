const mongoose=require('mongoose')

const restaurantSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    cuisine:{
        type:String
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
     image: {
        type: String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isActive: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })

module.exports=mongoose.model('Restaurant',restaurantSchema)