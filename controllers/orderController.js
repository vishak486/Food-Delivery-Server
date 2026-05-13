const { log } = require('console');
const Order=require('../models/orderModel')
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