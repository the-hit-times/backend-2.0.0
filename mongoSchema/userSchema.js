const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    email: {  type: String,  trim: true,  unique: 'Email already exists',  match: [/.+\@.+\..+/, 'Please fill a valid email address'],  required: 'Email is required' },
    password: {  type:String,required: true},
    created: {  type: Date,  default: Date.now }, 
    token:{  type:String}
})

const User=mongoose.model("user",userSchema)

module.exports=User