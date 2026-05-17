const { log } = require('console');
const Order=require('../models/orderModel')
const Restaurant=require('../models/restaurantModel')
const razorpay=require('../utils/razorpay')
const crypto =require('crypto')

exports.createOrderController=async(req,res)=>{
    console.log("Inside createOrderController");
    const { restaurantId, items, totalAmount,shippingAddress  } = req.body;
    console.log(req.body);
    try
    {
        const options={
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        }
        const razorpayOrder =await razorpay.orders.create(options)
        const newOrder=await Order.create({
            user:req.userId,
            restaurant: restaurantId,
            items,
            totalAmount,
            shippingAddress ,
            razorpayOrderId:razorpayOrder.id,
        })
        res.json({
        orderId: razorpayOrder.id,
        key: process.env.RAZORPAY_KEY_ID,
        amount: totalAmount,
        shippingAddress: newOrder.shippingAddress,
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.verifyPaymentController=async(req,res)=>{
    console.log("Inside verifyPaymentController ");
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    console.log(req.body);
    try
    {
        // Generate signature using secret
        const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

        if (generatedSignature === razorpaySignature) {
            const updatedOrder = await Order.findOneAndUpdate(
                { razorpayOrderId },
                {
                paymentStatus: "paid",
                razorpayPaymentId,
                razorpaySignature,
                orderStatus: "confirmed",
                },
                { new: true }
            );
            res.json({
                success: true,
                message: "Payment verified successfully",
                order: updatedOrder,
            });
        }
        else
        {
            //  Payment verification failed
            await Order.findOneAndUpdate(
                { razorpayOrderId },
                { paymentStatus: "failed", orderStatus: "cancelled" }
            );
            res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
    }
    catch(err)
    {
        res.status(500).json(err)
    } 
}

// Get all orders for the logged-in customer
exports.getCustomerOrdersController=async(req,res)=>{
    console.log("Inside getCustomerOrdersController");
    try
    {
        const orders=await Order.find({user: req.userId})
        .populate("restaurant","name cuisine address")
        .populate("items.food","name image price")
        .sort({ createdAt: -1 });

        res.status(200).json(orders)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
// Get single order detail
exports.getCustomerOrderDetailController=async(req,res)=>{
    console.log("Inside getCustomerOrderDetailController");
    const orderId = req.params.orderId
    try
    {
        const order=await Order.findOne({
            _id:orderId,user:req.userId
        }).populate("restaurant", "name cuisine address phone")
        .populate("items.food", "name image price category");
        
        res.status(200).json(order)
    }
    catch(err)
    {
        res.status(500).json(err)
    }  
}

exports.getRestaurantOrdersController=async(req,res)=>{
    console.log("Inside getRestaurantOrdersController");
    try
    {
        const restaurants=await Restaurant.findOne({owner:req.userId})
        if(!restaurants)
        {
            res.status(404).json("Restaurant Not Found")
        }
        const orders=await Order.find({restaurant:restaurants._id})
            .populate("user", "name email phone")
            .populate("items.food", "name image price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders)
    }
    catch(err)
    {
        res.status(500).json(err)
    } 
}

exports.updateOrderStatusController=async(req,res)=>{
    console.log("Inside updateOrderStatusController");
    const { orderId }=req.params
    const { orderStatus }=req.body
    console.log(orderStatus);
    
    const allowedStatuses = ["confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    try
    {
        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const restaurant=await Restaurant.findOne({owner:req.userId})
        if(!restaurant)
        {
            res.status(404).json("Restaurant Not Found")
        }
        const order=await Order.findOneAndUpdate({_id:orderId,restaurant:restaurant._id},{orderStatus},{returnDocument: 'after'})
        .populate("user", "name email phone")
        .populate("items.food", "name image price");

        res.status(200).json(order)
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.getAllOrdersController=async(req,res)=>{
    console.log("Inside getAllOrdersController");
    try
    {
        const orders = await Order.find()
        .populate("user", "name email phone")
        .populate("restaurant", "name cuisine address")
        .populate("items.food", "name image price")
        .sort({ createdAt: -1 });
        
        res.status(200).json(orders)
    }
    catch(err)
    {
        res.status(500).json(err)
    } 
} 