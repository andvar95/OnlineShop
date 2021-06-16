const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const MidRole = require("../middleware/role");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");



router.post("/create",Auth,User,MidRole.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const roleExists = await Role.findOne({
        name:req.body.name
    });

    if(roleExists)  return  res.status(401).send("Error: role already exists");

    const role = new Role({
        name:req.body.name,
        description:req.body.description,
        active:true
    });

    const roleSaved = await role.save();

    if(!roleSaved) return res.status(401).send("Failed to register role");

    return res.status(200).send({roleSaved})
})


router.get("/list",Auth,User,MidRole.haveRole('admin'),async(req,res)=>{

    const role = await Role.find();
    if(!role) return res.status(401).send("No Role")

    return res.status(200).send({role})
})


router.put("/update",Auth,User,MidRole.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const roleUpdated = await Role.findByIdAndUpdate(req.body._id,{
        name:req.body.name,
        description:req.body.description,
        active:req.body.active
    })

    if(!roleUpdated) return res.status(400).send("Error: Role couldn't  be updated")

    return res.status(200).send("Role  updated")

})



router.put("/delete",Auth,User,MidRole.haveRole('admin'),async(req,res)=>{

    if(!req.body.name ||  !req.body.description) return res.status(401).send("Error: Incomplete data");

    const roleUpdated = await Role.findByIdAndUpdate(req.body._id,{
        name:req.body.name,
        description:req.body.description,
        active:false
    })

    if(!roleUpdated) return res.status(400).send("Error: Role couldn't  be deleted")

    return res.status(200).send("Role  deleted")

})


module.exports = router;