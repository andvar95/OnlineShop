const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const Upload = require("../middleware/file")
const MidRole = require("../middleware/role");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");




router.post("/create",Auth,User,MidRole.haveRole('admin'),Upload.single("photo"),async(req,res)=>{
    if(!req.body.name  || 
        !req.body.description || 
        !req.body.category ||
        !req.body.price ||
        !req.body.supplier) return res.status(400).send("Error: Incomplete data ")

    let product = await Product.findOne({
        name:req.body.name
    }) 

    if(product) return res.status(400).send("This product already exists")

    const url = req.protocol + "://" + req.get("host")
    let imageUrl = "";
    if(req.file !== undefined && req.file.filename) imageUrl = url + "/uploads/"+req.file.filename

    product = new Product({
        photo:imageUrl,
        name:req.body.name,
        description:req.body.description,
        category:req.body.category,
        price:req.body.price,
        supplier:req.body.supplier,
        photo:imageUrl,
        active:true
    })

    const productSaved = await product.save();

    if(!productSaved) return res.status(400).send("Product Couldn't be registred")

    return res.status(200).send("Proudct registred")
}
)

router.get("/list/:name?",Auth,User,MidRole.haveRole('admin'),async(req,res)=>{
    const product = await Product.find({name:new RegExp(req.params["name"],"i")})
    .populate("category")
    .populate("supplier")
    .exec();
  
    if(!product) return res.status(401).send("Warning: No products")
    return res.status(200).send({ product });
  })


router.put("/update",Auth,User,MidRole.haveRole('admin'),Upload.single("photo"),async(req,res)=>{

    if(!req.body.name  || 
        !req.body.description || 
        !req.body.category ||
        !req.body.price ||
        !req.body.supplier) return res.status(400).send("Error: Incomplete data ")

        const url = req.protocol + "://" + req.get("host")
        let imageUrl = "";
        if(req.file !== undefined && req.file.filename) imageUrl = url + "/uploads/"+req.file.filename

    const product = await Product.findByIdAndUpdate( req.body._id,{
        photo:imageUrl,
        name:req.body.name,
        description:req.body.description,
        category:req.body.category,
        price:req.body.price,
        active:req.body.active,
        supplier:req.body.supplier
    })


    if(!product) return res.status(401).send("Error: product Could not be edited")
    return res.status(200).send({product})
  })


  router.put("/delete",Auth,User,MidRole.haveRole('admin'),Upload.single("photo"),async(req,res)=>{

    if(!req.body.name  || 
        !req.body.description || 
        !req.body.category ||
        !req.body.price ||
        !req.body.supplier) return res.status(400).send("Error: Incomplete data ")

        const url = req.protocol + "://" + req.get("host")
        let imageUrl = "";
        if(req.file !== undefined && req.file.filename) imageUrl = url + "/uploads/"+req.file.filename

    const product = await Product.findByIdAndUpdate( req.body._id,{
        photo:imageUrl,
        name:req.body.name,
        description:req.body.description,
        category:req.body.category,
        price:req.body.price,
        supplier:req.body.supplier,
        active:false
    })


    if(!product) return res.status(401).send("Error: product Could not be deleted")
    return res.status(200).send({product})
  })

module.exports = router;