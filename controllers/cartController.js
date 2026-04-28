const Food=require('../models/foodModel')
const Restaurant=require('../models/restaurantModel')
const Cart=require('../models/cartModel')

exports.addToCartController=async(req,res)=>{
    console.log("Inside addToCartController");
    const { foodId, quantity } = req.body;
    console.log('reqbody',req.body);
    console.log('requserid',req.userId);
    try
    {
        const food=await Food.findOne({ _id: foodId }).populate("restaurant");
        console.log("food object:", food);
        if (!food || !food.isAvailable) {
            return res.status(404).json({ message: "Food not available" });
        }
        let cart=await Cart.findOne({user:req.userId})
        console.log("cart object before:", cart);
        if(!cart)
        {
            cart=new Cart({
                user:req.userId,
                restaurant:food.restaurant._id,
                items: [{ food: food._id, quantity, price: food.price }]
            })
        }
        else
        {
             if (String(cart.restaurant) !== String(food.restaurant._id)) {
                return res.status(400).json({ message: "Cart can only contain items from one restaurant. Please clear your cart first." });
            }
            const existingItem = cart.items.find(i => String(i.food) === String(food._id));
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ food: food._id, quantity, price: food.price });
            } 
        }
        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
        console.log("cart before save:", cart);
        await cart.save();
        res.status(200).json(await cart.populate("items.food restaurant"));
    }
    catch(err)
    {
        console.error("Error in addToCartController:", err);
        res.status(500).json(err)
    } 
}

exports.getCartController=async(req,res)=>{
    console.log("Inside getCartController ");
    try
    {
        const cart = await Cart.findOne({ user: req.userId }).populate("items.food restaurant");
        if (!cart) {
        return res.status(404).json({ message: "Cart is empty" });
        }
        res.status(200).json(cart);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}