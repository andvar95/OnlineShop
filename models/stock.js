const mongoose = require("mongoose");


const stockSchema = new mongoose.Schema({
    productId:{type: mongoose.Schema.ObjectId,ref:"product"},
    quantity:Number,
    active:Boolean,
    date:{type:Date,default:Date.now}
})

stockSchema.methods.changeStock = function(productQuantity){
this.quantity += productQuantity;
if(this.quantity < 0) return false

return true

}

const Stock = mongoose.model("stock",stockSchema);

module.exports = Stock;