const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Role = require("../models/role");
const Upload = require("../middleware/file");
const MidRole = require("../middleware/role");
const Auth = require("../middleware/auth");
const MidUser = require("../middleware/user");

router.post(
  "/create",
  Auth,
  MidUser,
  MidRole.haveRole("admin"),
  Upload.single("avatar"),
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.address ||
      !req.file
    )
      return res.status(400).send("Error: Incomplete data ");

    if (req.params["error"])
      return res.status(401).send("Accepte format: .png, .jpg, .jpeg, .gif");

    const url = req.protocol + "://" + req.get("host");
    let imageUrl = "";
    if (req.file !== undefined && req.file.filename)
      imageUrl = url + "/uploads/" + req.file.filename;

    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) return res.status(400).send("This user already exists");

    const hash = await bcrypt.hash(req.body.password, 10);

    user = new User({
      avatar: imageUrl,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      address: req.body.address,
      roleId: req.body.roleId,
      active: true,
    });

    const userSaved = await user.save();

    if (userSaved) {
      const jwtToken = user.generateJWT();
      res.status(200).send({ jwtToken });
    } else {
      return res.status(400).send("Registration failed");
    }
  }
);

router.post(
  "/register",
  Auth,
  MidUser,
  Upload.single("avatar"),
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.address ||
      !req.file
    )
      return res.status(400).send("Error: Incomplete data ");

    if (req.params["error"])
      return res.status(401).send("Accepte format: .png, .jpg, .jpeg, .gif");

    const url = req.protocol + "://" + req.get("host");
    let imageUrl = "";
    if (req.file !== undefined && req.file.filename)
      imageUrl = url + "/uploads/" + req.file.filename;

    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) return res.status(400).send("This user already exists");

    const hash = await bcrypt.hash(req.body.password, 10);

    const role = await Role.findOne({ name: "usuario" });
    if (!role) return res.status(400).send("Error: This role doesn't exist");

    user = new User({
      avatar: imageUrl,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      address: req.body.address,
      roleId: role._id,
      active: true,
    });

    const userSaved = await user.save();

    if (userSaved) {
      const jwtToken = user.generateJWT();
      res.status(200).send({ jwtToken });
    } else {
      return res.status(400).send("Registration failed");
    }
  }
);

router.get(
  "/list/:name?",
  Auth,
  MidUser,
  MidRole.haveRole("admin"),
  async (req, res) => {
    const users = await User.find({ name: new RegExp(req.params["name"], "i") })
      .populate("roleId")
      .exec();

    if (!users) return res.status(401).send("Warning: No users");
    return res.status(200).send({ users });
  }
);

router.put(
  "/update",
  Auth,
  MidUser,
  MidRole.haveRole("admin"),
  Upload.single("avatar"),
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.address
    )
      return res.status(400).send("Error: Incomplete data ");

    if (req.params["error"])
      return res.status(401).send("Accepte format: .png, .jpg, .jpeg, .gif");

    const url = req.protocol + "://" + req.get("host");
    let imageUrl = "";
    if (req.file !== undefined && req.file.filename)
      imageUrl = url + "/uploads/" + req.file.filename;

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(req.body._id, {
      avatar: imageUrl,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      address: req.body.address,
      roleId: req.body.roleId,
      active: req.body.active,
    });

    if (!user) return res.status(401).send("Error: user Could not be edited");
    return res.status(200).send({ user });
  }
);

router.put(
  "/delete",
  Auth,
  MidUser,
  MidRole.haveRole("admin"),
  Upload.single("avatar"),
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.address
    )
      return res.status(400).send("Error: Incomplete data ");

    if (req.params["error"])
      return res.status(401).send("Accepte format: .png, .jpg, .jpeg, .gif");

    const url = req.protocol + "://" + req.get("host");
    let imageUrl = "";
    if (req.file !== undefined && req.file.filename)
      imageUrl = url + "/uploads/" + req.file.filename;

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(req.body._id, {
      avatar: imageUrl,
      name: req.body.name,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      address: req.body.address,
      roleId: req.body.roleId,
      active: false,
    });

    if (!user) return res.status(401).send("Error: user Could not be deleted");
    return res.status(200).send({ user });
  }
);

module.exports = router;
