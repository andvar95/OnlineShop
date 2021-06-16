const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    active:Boolean,
    userId:{type:mongoose.Schema.ObjectId, ref:"user"},
    finished:Boolean,
    date:{type:Date,
    default:Date.now}
})

const Order = mongoose.model("order",orderSchema);

module.exports  = Order;