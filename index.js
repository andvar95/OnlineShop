const express = require('express');
const {dbConnection } = require('./db/db');
const cors = require("cors");

/*ROUTES */
const User = require("./routes/user");
const Product = require("./routes/product");
const Role = require("./routes/role");
const Stock = require("./routes/stock");
const Category = require("./routes/category");
const Auth = require("./routes/auth");
const Order = require("./routes/order")
;
const OrderDetail = require("./routes/orderdetail");

const app = express();



require('dotenv').config()
app.use(express.json());
app.use(cors());
app.use("/api/user/",User);
app.use("/api/product/",Product);
app.use("/api/role/",Role);
app.use("/api/stock/",Stock);
app.use("/api/category/",Category);
app.use("/api/auth/",Auth);
app.use("/api/order/",Order);
app.use("/api/orderdetail",OrderDetail)


app.listen(process.env.PORT,()=>console.log("Runing Server in "+process.env.PORT))

dbConnection();