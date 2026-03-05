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
        const restaurant=await Restaurant.findById(restaurantId)
        if(!restaurant)
        {
            return res.status(404).json("Restaurant not found")
        }
        restaurant.isActive=true
        await restaurant.save()
        res.status(200).json("Restaurant Activated Successfully")
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

        const restaurant = await Restaurant.findById(restaurantId)

        if (!restaurant) {
            return res.status(404).json("Restaurant not found")
        }

        restaurant.isActive = false

        await restaurant.save()

        res.status(200).json("Restaurant Deactivated Successfully")

    } catch (err) {
        res.status(500).json(err)
    }
}