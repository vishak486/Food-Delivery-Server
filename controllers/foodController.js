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

