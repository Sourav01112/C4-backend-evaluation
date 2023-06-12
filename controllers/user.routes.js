const express = require("express");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// register
userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExits = await UserModel.findOne({ email });

    if (userExits) {
      return res.status(200).json({ msg: "User already exist, please login" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.json({ err: err.message });
      } else {
        const newUser = await new UserModel({ ...req.body, password: hash });
        await newUser.save();
        res
          .status(200)
          .json({ msg: "User successfully registered", newUser: req.body });
      }
    });
  } catch (err) {
    res.json({ err: err.message });
  }
});
// Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExits = await UserModel.findOne({ email });

    if (userExits) {
      bcrypt.compare(password, userExits.password, (err, result) => {
        if (result) {
          var token = jwt.sign(
            { userID: userExits._id, user: userExits.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
          );
          res.status(200).json({ msg: "login successful", token });
        } else {
          res.status(200).json({ err: "Wrong credentials" });
        }
      });
    } else {
      res.status(200).json({ err: "user does not exist" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

module.exports = { userRouter };
