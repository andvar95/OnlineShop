const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Role = require("../middleware/role");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");



router.post("/create",Auth,User,Role.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const catExists = await Category.findOne({
        name:req.body.name
    });

    if(catExists)  return  res.status(401).send("Error: category already exists");

    const category = new Category({
        name:req.body.name,
        description:req.body.description,
        active:true
    });

    const categorySaved = await category.save();

    if(!categorySaved) return res.status(401).send("Failed to register category");

    return res.status(200).send({categorySaved})
})


router.get("/list",Auth,User,Role.haveRole('admin'),async(req,res)=>{

    const category = await Category.find();
    if(!category) return res.status(401).send("No Categories")
    return res.status(200).send({category})
})


router.put("/update",Auth,User,Role.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const categoryUpdated = await Category.findByIdAndUpdate(req.body._id,{
        name:req.body.name,
        description:req.body.description,
        active:req.body.active
    })

    if(!categoryUpdated) return res.status(400).send("Error: Category couldn't  be updated")

    return res.status(200).send("Categoy  updated")

})



router.put("/delete",Auth,User,Role.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const categoryUpdated = await Category.findByIdAndUpdate(req.body._id,{
        name:req.body.name,
        description:req.body.description,
        active:false
    })

    if(!categoryUpdated) return res.status(400).send("Error: Category couldn't  be deleted")

    return res.status(200).send("Category  deleted")

})


module.exports = router;