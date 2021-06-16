const mongoose = require("mongoose");


const orderDetailSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.ObjectId, ref:"order"
    },
    productId:{
        type:mongoose.Schema.ObjectId, ref:"product"
    },
    quantity:Number,
    total:Number,
    date:{type:Date,
    default:Date.now}
})

const OrderDetail = mongoose.model("orderdetail",orderDetailSchema);

module.exports  = OrderDetail;