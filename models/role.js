const mongoose = require("mongoose");




///Creating Role Schema 

const roleSchema = new mongoose.Schema({
    name:String,
    description:String,
    active:Boolean,
    date:{type:Date,default:Date.now}
})

const Role = mongoose.model("role",roleSchema);


module.exports = Role;