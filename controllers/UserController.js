const bcrypt=require("bcryptjs");
const passport=require('passport');
const User=require("../Models/User")

const login_get=(req, res) => {
    res.render('login');
    };
const login_post=(req,res,next)=>{
    passport.authenticate('local', {
    successRedirect:'/dashboard', 
    failureRedirect: '/users/login', 
    failureFlash: true })(req,res,next);
    };
const logout_get=(req, res) => {
    req.logout((err)=> {
        if (err) {
            console.error('Error logging out:', err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
        });
    };
const register_get=(req, res) =>{ 
    res.render('register')
    };
const register_post=(req, res) => {
    let {name,email,password,password2}=req.body;
    const errors=[];
    if(!name || !email||!password||!password2){
        errors.push({msg:'please enter all the fields'});
    }
    if(password!=password2){
        errors.push({msg:"Passwords do not Match"});
    }
    if(password.length<6){
        errors.push({msg:"password should be at least 6 characters"})
    }
    if(errors.length>0){
        res.render("register",{errors}
        );
    }else{
        User.findOne({email:email}).then(user=>{
            if(user){
                errors.push({msg:"Email already registered"});
                res.render("register",{errors});
            }
            else{
                const newUser=new User({name,email,password});
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        
                        newUser.save().then(user=>{
                                req.flash('success_msg','You are now registered');
                                res.redirect('/users/login');
                            }).catch(err=>console.log(err));
                        


                    })
                });
            }
        }
        ).catch(err=>console.log(err))
    }

    };
module.exports={login_get,
        login_post,
        register_get,
        register_post,
        logout_get
        }