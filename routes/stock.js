const express = require("express");
const router = express.Router();
const Stock = require("../models/stock");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");
const Role = require("../middleware/role");

router.post(
  "/create",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    if (!req.body.productId || 
        !req.body.quantity) return res.status(401).send("Error: Incomplete data");

    const stockExists = await Stock.findOne({
      productId: req.body.productId,
    });

    if (stockExists) return res.status(401).send("Error: stock already exists");

    const stock = new Stock({
      productId: req.body.productId,
      quantity: req.body.quantity,
      active:true
    });

    const stockSaved = await stock.save();

    if (!stockSaved) return res.status(401).send("Failed to register stock");

    return res.status(200).send({ stockSaved });
  }
);

router.get(
  "/list",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    const stock = await Stock.find().populate("productId").exec();

    if (!stock) return res.status(401).send("No Stocks");

    return res.status(200).send({ stock });
  }
);

router.put(
  "/update",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    if (!req.body.productId || 
        !req.body.quantity ||
        !req.body.active) return res.status(401).send("Error: Incomplete data");

    const stockUpdated = await Stock.findByIdAndUpdate(req.body._id,{
      productId: req.body.productId,
      quantity: req.body.quantity,
      active:req.body.active
    });

    if (!stockUpdated) return res.status(401).send("Failed to update stock");

    return res.status(200).send({ stockUpdated });
  }
);

router.put(
  "/delete",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    if (!req.body.productId || 
        !req.body.quantity ) return res.status(401).send("Error: Incomplete data");

        const stockDeleted = await Stock.findByIdAndUpdate(req.body._id,{
            productId: req.body.productId,
            quantity: req.body.quantity,
            active:false
          });
      
          if (!stockDeleted) return res.status(401).send("Failed to delete stock");
      
          return res.status(200).send({ stockDeleted });
  }
);

module.exports = router;
