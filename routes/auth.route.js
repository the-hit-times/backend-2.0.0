const express = require("express");
const mongoose = require("mongoose");
const { authcheak, authcheakForsignin } = require("../middleware/authcheak");
const User = require("../mongoSchema/userSchema");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const new_user = new User(req.body);
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        res.json({ msg: "user already exist" });
      } else {
        new_user.save().then(async (result) => {
          const user = await User.findOne({ email: req.body.email });
          //jwt token creation
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
          user.token = token;
          user.save().then((r) => {
            console.log("user updated");
          });

          res.json({ msg: "user registered succesfully" });
        });
      }
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
});

router.post("/signin", authcheakForsignin, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!!user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.cookie("jwtoken", token, { expires: false, httpOnly: true });
      req.flash("postmsg", "you logged in succesfully");
      res.redirect("/pages/createpost");
    } else {
      req.flash("loginmsg", "invalid credentials");
      res.redirect("/pages/login");
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken");
  res.redirect("/pages/login");
});

module.exports = router;
