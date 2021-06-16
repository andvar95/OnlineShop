const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const mongoose = require("mongoose");
const Auth = require("../middleware/auth");
const User = require("../middleware/user");
const Role = require("../middleware/role");
const OrderDetail = require("../models/orderdetail");
const Product = require("../models/product");
const Stock = require("../models/stock");

/* Each detail have associated a orderId  */

router.post(
  "/create",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    if (!req.body.orderId || !req.body.quantity || !req.body.productId)
      return res.status(400).send("Error: data incomplete");

      /*Verify if prouct exists */
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).send("Error: product doesn't exist");

    /* getting the product stock*/
    let stock = await Stock.find({ productId: req.body.productId });
    if (!stock) return res.status(400).send("Error: stock doesn't exist");

    /* Changing the stock decreasing it when i added a produdct*/
    let changeStock = await stock[0].changeStock(-req.body.quantity);
    if (!changeStock) return res.status(400).send("Error: stock is not enough");

    const changedstock = await stock[0].save();
    if (!changedstock)
      return res.status(400).send("Error:Change stock was not possible");

      /*Calculating the price */ 
    let price = Number(product.price) * Number(req.body.quantity);

    let orderdetail = new OrderDetail({
      orderId: req.body.orderId,
      productId: req.body.productId,
      quantity: req.body.quantity,
      total: price,
    });

    let detailSaved = orderdetail.save();

    if (!detailSaved)
      return res.status(400).send("Error:Save detail was not possible");

    return res.status(200).send("Product added");
  }
);

router.put(
  "/update",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
      /*checing the product */
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).send("Error: product doesn't exist");

    /* Checing the stock*/
    let stock = await Stock.find({ productId: req.body.productId });
    if (!stock[0]) return res.status(400).send("Error: stock doesn't exist");

    /* Previous detail*/

    let previousDetail = await OrderDetail.findById(req.body._id);

    /* diffenrence between the previous stock and new stock*/
    let difference = previousDetail.quantity - req.body.quantity;

    /* using the difference*/
    let changeStock = await stock[0].changeStock(difference);
    if (!changeStock) return res.status(400).send("Error: stock is not enough");

    const changedstock = await stock[0].save();
    if (!changedstock)
      return res.status(400).send("Error:Change stock was not possible");

      /*if the quantity is 0 the detail will be deleted
       it works like delete method, then, you must put quantity 0 to delted a product in the  order
      */
    if (req.body.quantity === 0) {
      const deletedDetail = await OrderDetail.findByIdAndDelete(req.body._id);

      if (!deletedDetail)
        return res.status(400).send("error deleting this detail");

      return res.status(200).send("Product deleted");
    }

    let price = Number(product.price) * Number(req.body.quantity);

    let orderdetail = await OrderDetail.findByIdAndUpdate(req.body._id, {
      orderId: req.body.orderId,
      productId: req.body.productId,
      quantity: req.body.quantity,
      total: price,
    });

    if (!orderdetail)
      return res.status(401).send("Error: detail Could not be edited");

    return res.status(200).send({ orderdetail });
  }
);

router.get(
  "/list/:id",
  Auth,
  User,
  Role.haveRole("admin", "usuario", "empleado", "proveedor"),
  async (req, res) => {
    const orderDetails = await OrderDetail.find({ orderId: req.params["id"] })
      .populate("orderId")
      .populate("productId")
      .exec();

    if (!orderDetails) return res.status(200).send("No products");
    return res.status(200).send({ orderDetails });
  }
);

module.exports = router;
