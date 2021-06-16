const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    photo:String,
    name:String,
    description:String,
    active:Boolean,
    photo:String,
    category:{type:mongoose.Schema.ObjectId, ref:"categories"},
    price:Number,
    supplier:{type:mongoose.Schema.ObjectId, ref:"user"},
    date:{type:Date,
    default:Date.now}
})

const Product = mongoose.model("product",productSchema);

module.exports  = Product;