require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const app=express();
// passport 
require('./config/passport')(passport); 
app.use(express.json());
app.set('view engine','ejs');

app.use(express.static('public'));
//  Body Parser
app.use(express.urlencoded({extended:true}));
//  Express Session
app.use(session({secret:'seccret',resave:true,saveUninitialized:true}));
// passport middleware
app.use(passport.session());
app.use(passport.initialize());
//  connect Flash
app.use(flash());
// Global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});
app.listen(process.env.PORT,()=>{console.log(`app started on port ${process.env.PORT}`)});
const MongoURI=process.env.MONGO_URI;
mongoose.connect(MongoURI)
        .then(result=>console.log('mongo connected'))
        .catch(err=>console.error("connection failed  :",err));

//      Routes
app.use('/',require('./routes/index'));
app.use('/users', require('./routes/users'));
