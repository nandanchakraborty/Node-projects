const express = require('express');
const jwt = require('jsonwebtoken');
const  {isAuthenticated,verifyRefresh} = require('../authMiddleware/isAuthenticated')
const router = express.Router();


router.post('/login',(req,res)=>{
    const {email} = req.body;
    if(!email){
        res.status(400).json({error: "enter valid credientials"})

    }

    const accessToken = jwt.sign({email:email},
        "accessSecret",{
            expiresIn:"1h"
        }
    
    )
    const refreshToken = jwt.sign({email:email},
        "refreshSecret",{
            expiresIn:"1d"
        }
    )
    return res.status(200).json({accessToken,refreshToken});
});

//testing if jwt works

router.get('/protetcted',isAuthenticated,(req,res)=>{
    res.json({message:"welcome user"})
})

//RefreshToken verification
router.post('/refresh',(req,res)=>{
    const {email,refreshToken} = req.body;
    const isValid = verifyRefresh(email,refreshToken);

    if(!isValid){
        res.status(401).json({msg: 'Invalid token'})

    }
    const accessToken = jwt.sign({ email: email }, "accessSecret", {
expiresIn: "1h",
});
return res.status(200).json({ success: true, accessToken });
});


module.exports = router;
