const mongoose=require('mongoose')

const dbConnection=process.env.DBCONNECTIONSTRING

mongoose.connect(dbConnection).then((res)=>{
    console.log('Mongodb Atlas Connected Successfully');
}).catch(err=>{
    console.log('Mongodb Atlas Connection Failed',err);
})