const express=require('express')
const userController=require('../controllers/userController')
const restaurantController=require('../controllers/restaurantController')
const categoryController=require('../controllers/categoryController')
const foodController=require('../controllers/foodController')
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

// Admin Creating Categories
router.post('/createCategory',jwtMiddleware,roleMiddleware(['admin']),categoryController.createCategoryController)

// Admin Get All Categories(both Active and inActive)
router.get('/admin/getAllCategory',jwtMiddleware,roleMiddleware(['admin']),categoryController.getAllCategoriesControllerForAdmin)

// Admin Deactivate category
router.put('/admin/deactivateCategory/:categoryId',jwtMiddleware,roleMiddleware(['admin']),categoryController.deActivateCategoryController)

// Admin Activate Category
router.put('/admin/activateCategory/:categoryId',jwtMiddleware,roleMiddleware(['admin']),categoryController.ActivateCategoryController)

// Admin Update Category
router.put('/admin/updateCategory/:categoryId',jwtMiddleware,roleMiddleware(['admin']),categoryController.updateCategoryController)

// Restaurant_admin creates Food
router.post('/createFood',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),foodController.createFoodController)

module.exports=router