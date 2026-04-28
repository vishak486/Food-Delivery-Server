const mongoose=require('mongoose')

const cartSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true
    },
    items:[
        {
            food:{type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true},
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, default: 0 }
},{timestamps:true})

module.exports=mongoose.model("Cart",cartSchema)