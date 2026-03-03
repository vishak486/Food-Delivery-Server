require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./routes/router')
require('./database/dbConnection')


const foodServer=express()

foodServer.use(cors())
foodServer.use(express.json())
foodServer.use(router)

const PORT=3000 || process.env.PORT

foodServer.listen(PORT,()=>{
    console.log(`Server Started at PORT ${PORT}`);  
})

foodServer.get('/',(req,res)=>{
    res.status(200).send('<h1 style="color:green;">Server is running<h1>')
})

// foodServer.post('/',(req,res)=>{
//     res.status(200).send('POST REQUEST')
// })
