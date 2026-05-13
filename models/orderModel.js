const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
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
            food:{ type:mongoose.Schema.Types.ObjectId,ref:"Food",required:true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String,
    },
    paymentStatus:{
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus:{
        type: String,
        enum: ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
        default:"placed"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
}, { timestamps: true })

module.exports=mongoose.model("Order",orderSchema)