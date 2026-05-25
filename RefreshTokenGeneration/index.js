const express = require('express');
const userRouter = require('./userHandler.js/user');
const app = express();

app.use(express.json());
app.use('/user', userRouter);

app.get('/',(req,res)=>{
    res.send("hello world refresh");
})


app.listen(3000,()=>{
    console.log("server running on port 3000");
})