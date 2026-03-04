const express=require('express')
const userController=require('../controllers/userController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')
const roleMiddleware=require('../middlewares/roleMiddleware')
const uploads=require('../middlewares/multerMiddleware')

const router=express.Router()

// login
router.post('/login',userController.loginController)

// Register Customer
router.post('/registerCustomer',userController.registerCustomerController)

// Register Restaurant
router.post('/registerRestaurant',userController.registerRestaurantController)

// Admin Approve Restaurant_Admin
router.put('/approveRestaurant/:userId',jwtMiddleware,roleMiddleware(['admin']),userController.approveRestaurantAdminController)

module.exports=router