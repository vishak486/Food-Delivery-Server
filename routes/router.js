const express=require('express')
const userController=require('../controllers/userController')
const restaurantController=require('../controllers/restaurantController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')
const roleMiddleware=require('../middlewares/roleMiddleware')
const multerMiddleware=require('../middlewares/multerMiddleware')

const router=express.Router()

// login
router.post('/login',userController.loginController)

// Register Customer
router.post('/registerCustomer',userController.registerCustomerController)

// Register Restaurant
router.post('/registerRestaurant',userController.registerRestaurantController)

// Admin Approve Restaurant_Admin
router.put('/approveRestaurant/:userId',jwtMiddleware,roleMiddleware(['admin']),userController.approveRestaurantAdminController)

// Restaurant_Admin creating Restaurant profile
router.post('/createRestaurant',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),restaurantController.createRestaurantController)

// Admin Activate Restaurant profile created by Restaurant_Admin
router.put('/activateRestaurant/:restaurantId',jwtMiddleware,roleMiddleware(['admin']),restaurantController.activateRestaurantController)

// Admin DeActivate Restaurant profile created by Restaurant_Admin
router.put('/deactivateRestaurant/:restaurantId',jwtMiddleware,roleMiddleware(['admin']),restaurantController.deactivateRestaurantController)


module.exports=router