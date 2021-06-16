const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");
const Role = require("../middleware/role");



/* each user can create a order  and the order is associated with a order detail 
that constains products
*/
router.post("/create",Auth,User,Role.haveRole("admin","usuario","empleado","proveedor"),async(req,res)=>{

    if(!req.body.userId) return res.status(401).send("Error: Incomplete data");

    const order = new Order({
        userId:req.body.userId,
        finished:false,
        active:true
    });

    const orderSaved = await order.save();

    if(!orderSaved) return res.status(401).send("Failed to register order");
    return res.status(200).send({orderSaved})
})


router.get("/list",Auth,User,Role.haveRole("admin","usuario","empleado","proveedor"),async(req,res)=>{

    const order = await Order.find({userId:req.user._id}).populate("userId");
    if(!order) return res.status(401).send("No Role")

    return res.status(200).send({order})
})



router.put("/update",Auth,User,Role.haveRole("admin","usuario","empleado","proveedor"),async(req,res)=>{

    if(!req.body.userId ||
        !req.body.finished) return res.status(401).send("Error: Incomplete data");

    const orderUpdated = await Order.findByIdAndUpdate(req.body._id,{
        userId:req.body.userId,
        finished:req.body.finished,
        active:true
    });


    if(!orderUpdated) return res.status(401).send("Failed to register order");
    return res.status(200).send({orderUpdated})
})



router.put("/delete",Auth,User,Role.haveRole("admin","usuario","empleado","proveedor"),async(req,res)=>{

    if(!req.body.userId ||
        !req.body.finished) return res.status(401).send("Error: Incomplete data");

    const orderDeleted = await  Order.findByIdAndUpdate(req.body._id,{
        userId:req.body.userId,
        finished:req.body.finished,
        active:false
    });


    if(!orderDeleted) return res.status(401).send("Failed to register order");
    return res.status(200).send({orderDeleted})
})
module.exports = router;