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
// Admin Reject Restaurant_Admin
router.put('/rejectRestaurant/:userId',jwtMiddleware,roleMiddleware(['admin']),userController.rejectRestaurantAdminController)


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

// Admin Get all Users
router.get('/admin/getAllUsers',jwtMiddleware,roleMiddleware(['admin']),userController.getAllUsersController)

// Admin Block users
router.put('/admin/blockUsers/:userId',jwtMiddleware,roleMiddleware(['admin']),userController.AdminBlockUsersController)

// Admin Unblock Users
router.put('/admin/unBlockUsers/:userId',jwtMiddleware,roleMiddleware(['admin']),userController.AdminUnBlockUsersController)

// Admin Get All Restaurants
router.get('/admin/allRestaurants',jwtMiddleware,roleMiddleware(['admin']),restaurantController.getAllRestaurantController)

// Restaurant_admin creates Food
router.post('/restaurant/createFood',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),foodController.createFoodController)
// Restaurant_admin getRestaurant Profile
router.get('/restaurant/myRestaurant',jwtMiddleware,roleMiddleware(['restaurant_admin']),restaurantController.getMyRestaurantController)

// Restaurant_Admin creating Restaurant profile
router.post('/restaurant/createRestaurant',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),restaurantController.createRestaurantController)

// restaurnat Admin fetch All foods
router.get('/restaurant/fetchAllFoods',jwtMiddleware,roleMiddleware(['restaurant_admin']),foodController.fetchAllFoodController)

// restaurant Admin fetch All Categories
router.get('/restaurant/getAllCategoryForRestaurant',jwtMiddleware,roleMiddleware(['restaurant_admin']),categoryController.getAllCategoriesControllerForRestaurantAdmin)

// Restaurant Admin Updating Food
router.put('/restaurant/editFood',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),foodController.editFoodController)
// Restaurant Admin Fetch Food created by each restaurant
router.get('/restaurant/fetchEachFood',jwtMiddleware,roleMiddleware(['restaurant_admin']),foodController.fetchFoodsByRestaurantController)

// Restaurant Admin Update Food into UnAVailable
router.put('/restaurant/unAvailableFood/:foodId',jwtMiddleware,roleMiddleware(['restaurant_admin']),foodController.updateIntoUnavailableFoodController)
// Restaurant Admin Update Food into AVailable
router.put('/restaurant/AvailableFood/:foodId',jwtMiddleware,roleMiddleware(['restaurant_admin']),foodController.updateIntoAvailableFoodController)
// Restaurant Admin updates Restaurant Profile
router.put('/restaurant/editRestaurant',jwtMiddleware,roleMiddleware(['restaurant_admin']),multerMiddleware.single('image'),restaurantController.editRestaurantProfileController)


module.exports=router