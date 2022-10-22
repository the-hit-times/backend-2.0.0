const express = require('express');
const mongoose = require("mongoose");
const authcheak= require("../middleware/authcheak")
const User= require("../mongoSchema/userSchema");
const jwt= require("jsonwebtoken")

const bcrypt = require("bcrypt")
const Router = express.Router();

//register routes////////////////////////

Router.post("/register",(req,res)=>{
    req.body.password=bcrypt.hashSync(req.body.password, 10);
    const new_user=new User(req.body)
  // console.log(req.body)
   User.findOne({email:req.body.email}).then(result=>{
        if(result){
            res.json({msg:"user already exist"})
        }
        else{
            new_user.save().then(async (result)=>{
                const user=await User.findOne({email:req.body.email});
                //jwt token creation
                const token=jwt.sign({_id:user._id},process.env.SECRET_KEY);
                user.token=token;
                user.save().then((r)=>{console.log("user updated")})
                
                res.json({msg:"user registered succesfully"})
            })
        }
    }).catch(err=>{
        res.json({msg:err.message})
    })
})



//login routes///////////////////////////

Router.get("/login",authcheak.authcheakForsignin,(req, res)=>{
    res.render("signin",{ loginResponse: req.flash('loginmsg') })
})

Router.post("/api/signin",authcheak.authcheakForsignin,async (req,res)=>{
    try{
         const user=await User.findOne({email:req.body.email});
         if(user){
             if(bcrypt.compareSync(req.body.password,user.password))
             {
                 //jwt token creation
                 const token=jwt.sign({_id:user._id},process.env.SECRET_KEY);
                // console.log(token)
                 //save jwt in cookies
                 res.cookie('jwtoken', token, { expires: false, httpOnly: true });
                 req.flash('postmsg', 'you logged in succesfully')
                 res.redirect('/posts')
             }
             else{
                req.flash('loginmsg', 'invalid credentials')
                 res.redirect('/login')
             }
         }
         else{
            req.flash('loginmsg', 'invalid credentials')
             res.redirect('/login')
         }
     }
     catch(err){
         return res.status(400).json({error: err.message})
     }
 })

 //logout user///////////////////

 Router.get("/logout",(req,res)=>{
    res.clearCookie("jwtoken");
    res.redirect('/login')
})


module.exports =Router