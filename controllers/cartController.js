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

exports.updateCartItemController=async(req,res)=>{
    console.log("Inside updateCartItemController ");
    const { foodId } = req.params;
    const { quantity } = req.body;
    try
    {
        let cart=await Cart.findOne({user:req.userId})
        if(!cart) return res.status(404).json({message:"Cart not Found"})
        
        const item = cart.items.find(i => String(i.food) === String(foodId));
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity=quantity
        cart.totalAmount=cart.items.reduce((sum,i)=>sum+i.quantity*i.price,0)
        await cart.save()
        const populatedCart = await Cart.findById(cart._id).populate("items.food restaurant");
        res.status(200).json(populatedCart)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
exports.removeCartItemController=async(req,res)=>{
    console.log("Inside removeCartItemController");
    const { foodId } = req.params;
    try
    {
        let cart = await Cart.findOne({ user: req.userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter(i => String(i.food) !== String(foodId));
        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
        if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return res.status(200).json({ message: "Cart cleared" });
        }
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate("items.food restaurant");
        res.status(200).json(populatedCart);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}