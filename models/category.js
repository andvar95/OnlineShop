const mongoose = require("mongoose");


const categoriesSchema = new mongoose.Schema({
    name:String,
    description:String,
    active:Boolean,
    date:{type:Date,
    default:Date.now}
})

const Categories = mongoose.model("categories",categoriesSchema);

module.exports  = Categories;