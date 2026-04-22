const Restaurant =require('../models/restaurantModel')

// create Restaurant Profile

exports.createRestaurantController=async(req,res)=>{
    console.log('Inside createRestaurantController');
    const{name,description,cuisine,street,city,state,pincode}=req.body
    const image=req.file?req.file.filename: null
    try
    {
        const existingRestaurant=await Restaurant.findOne({owner:req.userId})
        if(existingRestaurant)
        {
            return res.status(406).json("Restaurant Already Exists")
        }
        const newRestaurant = new Restaurant({
            name,
            description,
            cuisine,
            address:{
                street,
                city,
                state,
                pincode
            },
            image,
            owner:req.userId
        })

        await newRestaurant.save()
        res.status(200).json("Restaurant Profile Created Successfully")
    }
    catch(err)
    {
        res.status(500).json(err)
    }  
}

// admin restaurant Activate system
exports.activateRestaurantController=async(req,res)=>{
    console.log("Inside activateRestaurantController");
    const {restaurantId}=req.params
    console.log(restaurantId);
    
    try
    {
        const restaurant=await Restaurant.findById(restaurantId).populate("owner", "name email")
        if(!restaurant)
        {
            return res.status(404).json("Restaurant not found")
        }
        restaurant.isActive=true
        await restaurant.save()
        res.status(200).json(restaurant)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
    
}

// admin restaurant DeActivate system
exports.deactivateRestaurantController = async (req, res) => {
    console.log("Inside deactivateRestaurantController");

    const { restaurantId } = req.params;

    try {

        const restaurant = await Restaurant.findById(restaurantId).populate("owner", "name email")

        if (!restaurant) {
            return res.status(404).json("Restaurant not found")
        }

        restaurant.isActive = false

        await restaurant.save()

        res.status(200).json(restaurant)

    } catch (err) {
        res.status(500).json(err)
    }
}

// Get my restaurant profile
exports.getMyRestaurantController=async(req,res)=>{
    console.log("Inside getMyRestaurantController");
    try
    {
        const restaurant=await Restaurant.findOne({ owner: req.userId })
        if(!restaurant)
        {
            return res.status(404).json(null)
        }
        res.status(200).json(restaurant)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
    
}

exports.editRestaurantProfileController=async(req,res)=>{
    console.log("Inside editRestaurantProfileController");
    const { name, description, cuisine, street, city, state, pincode } = req.body;
    const image = req.file ? req.file.filename : null;
    try
    {
        const restaurant = await Restaurant.findOne({ owner: req.userId });
        if (!restaurant) {
        return res.status(404).json("Restaurant not found");
        }
        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.cuisine = cuisine || restaurant.cuisine;
        restaurant.address = {
        street: street || restaurant.address?.street,
        city: city || restaurant.address?.city,
        state: state || restaurant.address?.state,
        pincode: pincode || restaurant.address?.pincode,
        };
         if (image) {
        restaurant.image = image;
        }
        await restaurant.save();
        res.status(200).json(restaurant);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
    
}

// Get all restaurant profiles (Admin only)

exports.getAllRestaurantController=async(req,res)=>{
    console.log("Inside getAllRestaurantController");
    const searchKey=req.query.search
    const query=searchKey?{name:{ $regex:searchKey,$options:'i' }}:{};
    try
    {
        
        const restaurants=await Restaurant.find(query).populate("owner","name email")
        if(!restaurants)
        {
            return res.status(404).json("No Restaurants Found")
        }
        res.status(200).json(restaurants)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}