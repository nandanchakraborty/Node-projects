require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const PORT = 3000 || process.env.PORT;

const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/blogs')
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));
    


app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}));



app.locals.isActiveRoute = (route, currentRoute) =>
    route === currentRoute ? 'active' : '';
//templating engine

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');


app.use('/',require('./server/route/main'))
app.use('/',require('./server/route/admin'))

app.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`);
})