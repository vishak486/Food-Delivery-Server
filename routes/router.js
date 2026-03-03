const express=require('express')
const userController=require('../controllers/userController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')

const router=express.Router()

// login
router.post('/login',userController.loginController)

module.exports=router