const express = require('express');
const router = express.Router();
const post = require('../models/post');

//getting all the posts and paginition
router.get('',async(req,res) =>{
 
    try{
         const locals = {
     title : "Personal Blog",
     description : "simple blog with node and express"   
    }
    let perPage = 5;
    let page = req.query.page || 1;
    const data = await post.aggregate([{ $sort :{createdAt:-1}}])
    .skip(perPage*page - perPage)
    .limit(perPage)
    .exec();
const count = await post.countDocuments();

const nextPage = page + 1;

const hasNextpage = page * perPage < count;

    res.render('index',{
        locals,
        data,
        current:page,
        nextPage :hasNextpage? nextPage : null,
        currentRoute: '/'
    });
    }catch(err){
        console.log(err);

    }
});

//get post details 

router.get('/post/:id',async(req,res)=>{
    try{
         const locals = {
     title : "Personal Blog",
     description : "simple blog with node and express"   
    }
    let slug = req.params.id;
    const data = await post.findById({_id:slug});
    res.render('post',{locals,data,currentRoute:`/post/${slug}`});

    }catch(err){
        console.log(err);


    }
})

//getting post by search
router.post('/search' ,async(req,res)=>{
      try{
         const locals = {
     title : "Search",
     description : "simple blog with node and express"   
    }
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");


    const data = await post.find({
        $or:[
            {title:{$regex:new RegExp(searchNoSpecialChar,'i')}},
            {body :{$regex:new RegExp(searchNoSpecialChar,'i')}}
        ]
    });
    res.render('search',
        {locals,
        data,
        currentRoute:'/'
    
    });
}catch(err){
    console.log(err);
}
})







router.get('/about',(req,res)=>{
  res.render('about',{
    currentRoute:'/about'
  });
    
})

router.post('/contact' ,(req,res)=>{
    res.send(hello);
})

module.exports = router;


