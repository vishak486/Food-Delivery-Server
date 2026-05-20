const User=require('../models/userModel')
const Restaurant=require('../models/restaurantModel')
const Order=require('../models/orderModel')

exports.getDashboardStatsAdminController=async(req,res)=>{
    console.log("Inside getDashboardStatsAdminController");
    try
    {
        const [ totalRestaurants, totalUsers ,totalOrders,pendingApprovals]=await Promise.all([
            Restaurant.countDocuments(),
            User.countDocuments({role:'customer'}),
            Order.countDocuments(),
            Restaurant.countDocuments({ isApproved: false }),
        ])

        res.status(200).json({
            totalRestaurants,totalUsers,totalOrders,pendingApprovals
        })
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}

exports.getDashboardStatsRestaurantAdminController=async(req,res)=>{
    console.log("Inside getDashboardStatsRestaurantAdminController");
    try
    {
        const restaurant = await Restaurant.findOne({ owner: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
         const todayStart = new Date();
         todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
         const [todaysOrders, todaysRevenueData, pendingOrders, totalOrders] = await Promise.all([
            Order.countDocuments({
                restaurant:restaurant._id,
                createdAt:{$gte:todayStart,$lte:todayEnd}
            }),
            Order.aggregate([
                {
                    $match:{
                        restaurant:restaurant._id,
                        paymentStatus:"paid",
                        createdAt: { $gte: todayStart, $lte: todayEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]),
            Order.countDocuments({
                restaurant: restaurant._id,
                orderStatus: { $in: ["placed", "confirmed"] }
            }),
            // Total orders all time
            Order.countDocuments({ restaurant: restaurant._id })
         ])

         res.status(200).json({
            todaysOrders,
            todaysRevenue: todaysRevenueData[0]?.total || 0,
            pendingOrders,
            totalOrders,
        })
    }
    catch(err)
    {
        res.status(500).json(err)
    }   
}