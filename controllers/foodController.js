const Food=require('../models/foodModel')
const Restaurant=require('../models/restaurantModel')
const Category=require('../models/categoryModel')

exports.createFoodController=async(req,res)=>{
    console.log("Inside createFoodController");
    const { name, description, price, categoryId } = req.body
    try
    {
        const restaurant=await Restaurant.findOne({owner:req.userId})
        if(!restaurant)
        {
            return res.status(404).json("Restaurant not Found for this user")
        }
        const category=await Category.findById(categoryId)
        if(!category || !category.isActive)
        {
            return res.status(404).json("Invalid or Inactive Category")
        }
        const image=req.file?req.file.filename:null
        const newFood=new Food({
            name,description,price,category:categoryId,restaurant:restaurant._id,image
        })
        await newFood.save()
        res.status(200).json("Food Created Successfully")
    }
    catch(err)
    {
        res.status(500).json(err)
    } 
}
// Fetch All foods from every restaurant
exports.fetchAllFoodController=async(req,res)=>{
    console.log('Inside fetchAllFoodController');
    const searchKey=req.query.search
    const query=searchKey?{name:{ $regex:searchKey,$options:'i' }}:{};
    try
    {
        const allFoods=await Food.find(query).populate("category","name").populate("restaurant","name")
        res.status(200).json(allFoods)
    }
    catch(err)
    {
        res.status(500).json(err)
    }  
}

exports.editFoodController=async(req,res)=>{
    console.log("Inside editFoodController");
    const {foodId,name,description,price,categoryId}=req.body
    console.log(req.body);
    try
    {
        const restaurant=await Restaurant.findOne({owner:req.userId})
        if(!restaurant)
        {
          return res.status(404).json("Restaurant not Found for this user")   
        }

        const category=await Category.findById(categoryId)
        if (!category || !category.isActive) 
        {
        return res.status(404).json("Invalid or Inactive Category");
        }
        // Handle image update
        const image = req.file ? req.file.filename : undefined;
        const updateData={
            name,description,price,category:categoryId
        }
        if(image) updateData.image=image
        const updateFood=await Food.findOneAndUpdate(
            {_id:foodId,restaurant:restaurant._id},updateData,{ returnDocument: 'after' }
        )
        if (!updateFood) {
        return res.status(404).json("Food not found for this restaurant");
        }
        res.status(200).json(updateFood);
    }
    catch(err)
    {
        console.error("EditFood error:", err)
        res.status(500).json(err)
    }
    
}

// Fetch Food created each restaurant
exports.fetchFoodsByRestaurantController=async(req,res)=>{
    console.log("Inside fetchFoodsByRestaurantController");
    const searchKey = req.query.search;
    try
    {
        const restaurant = await Restaurant.findOne({ owner: req.userId });
        if (!restaurant) {
        return res.status(404).json("Restaurant not found for this user");
        }
        const query={
            restaurant:restaurant._id
        };
        if (searchKey) {
        query.name = { $regex: searchKey, $options: 'i' };
        }
        const foods = await Food.find(query).populate("category", "name").populate("restaurant", "name");
         res.status(200).json(foods);
    }
    catch(err)
    {
        res.status(500).json(err)
    } 
}

exports.updateIntoUnavailableFoodController=async(req,res)=>{
    console.log("Inside updateUnavailableFoodController");
    const {foodId}=req.params
    try
    {
        const existingFood=await Food.findById(foodId)
        if(!existingFood)
        {
            res.status(404).json("Food not exist")
        }
        existingFood.isAvailable=false
        await existingFood.save()
        res.status(200).json(existingFood)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
exports.updateIntoAvailableFoodController=async(req,res)=>{
    console.log("Inside updateIntoAvailableFoodController");
    const { foodId } =req.params
    try
    {
        const existingFood=await Food.findById(foodId)
        if(!existingFood)
        {
            res.status(404).json("Food Not Exists")
        }
        existingFood.isAvailable=true
        await existingFood.save()
        res.status(200).json(existingFood)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
    
}

// Customer: Get all active foods for a restaurant
exports.getFoodsByRestaurantController=async(req,res)=>{
    console.log("Inside getFoodsByRestaurantController");
    const { restaurantId } = req.params;
    try
    {
        const foods=await Food.find({restaurant: restaurantId,isAvailable:true})
        res.status(200).json(foods)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
