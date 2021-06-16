const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");



router.post("/login",async(req,res)=>{

    const user = await User.findOne({email:req.body.email
    });

    if(!user) return res.status(400).send("Email incorrect")

    const hash = await bcrypt.compare(req.body.password,user.password);

    if(!hash || !user.active)  return res.status(400).send("password incorrect")


    try{
        const token = user.generateJWT();
        return res.status(200).send({token});

    }
    catch(e){
        return res.status(400).send("Login Error");
    }

})

module.exports = router;