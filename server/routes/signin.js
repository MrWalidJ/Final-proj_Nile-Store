const express = require("express");
const joi = require("joi");
const { generateToken } = require("../utils");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const router = express.Router();

const loginSchema = joi.object({
  email: joi.string().required().min(6).email(),
  password: joi.string().required().min(5),
});

router.post("/", async (req, res) => {
  try {
    //1. joi validation for body
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    //2.  check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid email or password");

    //3. check passwordif it's true for the user , using compare
    const result = await bcrypt.compare(req.body.password, user.password); //(pass in request , pass in DB)
    if (!result) return res.status(400).send("Invalid email or password");

    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(400).send("Error in posting user login");
  }
});

module.exports = router;
