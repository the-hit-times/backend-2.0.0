const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const {authcheak,authcheakForsignin} = require("../middleware/authcheak")
const Post = require('../mongoSchema/postSchema')


router.get("/login", authcheakForsignin, (req, res) => {
    res.render("signin", { loginResponse: req.flash('loginmsg') })
})

router.get("/createpost", authcheak, (req, res) => {
    res.render("post", { postResponse: req.flash('postmsg'), notificationResponse: req.flash('notifymsg')  })
})

router.get("/sendnotification", authcheak, (req, res) => {
    res.render("notification", { notificationResponse: req.flash('notifymsg') })
})

router.get("/display", async (req, res) => {
    var allposts = await Post.find().sort({createdAt:-1})
    res.render("display", { posts: allposts, delResponse: req.flash('delmsg') })
})

router.get("/post/edit/:postId", authcheak, async (req, res) => {
    let data = await Post.findById({ _id: req.params.postId })
    if (data) {
        res.render("Edit", { postData: data, editResponse: req.flash('editmsg') })
    }
})

module.exports =router;
