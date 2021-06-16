const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");



///Creeatig uSER SCHEMA

const userSchema = new mongoose.Schema({
    avatar:String,
    name:String,
    email:String,
    password:String,
    roleId:{type:mongoose.Schema.ObjectId, ref:"role"},
    phone:String,
    address:String,
    active:Boolean,
    date:{type:Date,
    default:Date.now}
})


userSchema.methods.generateJWT = function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        roleId:this.roleId,
        iat:moment().unix()
    },
    process.env.secretKey)
}


const User = mongoose.model("user",userSchema);


module.exports = User;