var jwt = require('jsonwebtoken')
const User=require("../mongoSchema/userSchema")

const getUser=async (req,res,next)=>{
        const token=req.cookies.jwtoken;
        if(token==null){
            res.locals.user=null;
            next();
        }
        else{
        const verifiedtoken=jwt.verify(token,process.env.SECRET_KEY);
        const user=await User.findOne({_id:verifiedtoken._id})
        if(!user){
            res.locals.user=null
            next();
        }
        else{
            res.locals.user=user;
            next();
        }
        }
        
}

module.exports=getUser