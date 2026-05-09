const express = require('express');
const router = express.Router();
const post = require('../models/post');
const User = require('../models/user')
const adminLayout = '../views/layouts/admin';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

//check authmiddleware or check login
const authmiddleware = (req,res,next) =>{
    const token = req.cookies?.token
    if(!token){
        return res.status(401).json({message :'unauthorized '});
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();

    }catch(err){
                return res.status(401).json({message :'unauthorized '});


    }
}

//admin panel page
router.get('/admin',async(req,res)=>{
    try{
        const locals ={
            title:"Admin",
            description:"Simple blog creation with node,express and mongodb"
        }
        res.render('admin/index',{locals,layout:adminLayout})

    }catch(err){
        console.log(err);
    }
})

//admin check login
router.post('/admin',async(req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message :'invalid credentials'});

        }
        const isPassValid = await bcrypt.compare(password,user.password);
        if(!isPassValid){
                        return res.status(401).json({message :'invalid credentials'});


        }
        const token = jwt.sign({userId:user._id},jwtSecret)
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');
    }catch(err){
        console.log(err);
    }
})
router.get('/dashboard', authmiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * GET /
 * Admin - Create New Post
*/
router.get('/add-post', authmiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await post.find();
    res.render('admin/add-post', {
      locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }

});

//add post
router.post('/add-post',authmiddleware,async(req,res)=>{
    try{
        try{
            const newPost = new post({
                title:req.body.title,
                body:req.body.body
            });
            await post.create(newPost);
            res.redirect('/dashboard');
        }catch(err){
            console.log(err);
        }
    }catch(err){
            console.log(err);
        }

})

//edit_post 
router.get('/edit-post/:id',async(req,res)=>{
    try{
        const locals = {
            title : 'Edit post',
            Description: 'Personal blog with node and express'
        
        }
        const data = await post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{
            locals,
            data,
            layout:adminLayout
        })

    }catch(err){
        console.log(err);

    }

})
//upadte post 

router.post('/edit-post/:id',async(req,res)=>{
    try{
        await post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt:Date.now()

        });
        res.redirect(`/edit-post/${req.params.id}`);
    }catch(err){
        console.log(err);
    }
})
router.post('/delete-post/:id',async(req,res)=>{
    try{
        await post.deleteOne({_id:req.params.id});
        res.redirect('/dashboard');
    }catch(err){
        console.log(err);
    }
})










router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


























// //register check
// router.post('/register',async(req,res)=>{
//     try{
//         const {username,password} = req.body;
//         const hashedPassword = await bcrypt.hash(password,12);
//         try{
//         const newUser = await User.create({username,password:hashedPassword});
//         res.status(201).json({message : 'User created ',newUser});

//         }catch(err){
//         if(err.code === 11000){
//             res.status(409).json({message :'user already exist'});
//         }
//         else{res.status(500).json({message :'internal server error'})};
//     }
// }catch(err){
//     console.log(err);

//     }
// })












module.exports = router;