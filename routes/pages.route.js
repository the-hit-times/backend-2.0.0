const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const {authcheak,authcheakForsignin} = require("../middleware/authcheak")
const Post = require('../mongoSchema/postSchema')
const MatchPost = require('../mongoSchema/matchPostSchema')


router.get("/login", authcheakForsignin, (req, res) => {
    res.render("signin", { loginResponse: req.flash('loginmsg') })
})

router.get("/createpost", authcheak, (req, res) => {
    res.render("post", { postResponse: req.flash('postmsg'), notificationResponse: req.flash('notifymsg')  })
})

router.get("/live/create", authcheak, (req, res) => {
    res.render("live/live", { postResponse: req.flash('postmsg'), notificationResponse: req.flash('notifymsg')  })
})

router.get("/sendnotification", authcheak, (req, res) => {
    res.render("notification", { notificationResponse: req.flash('notifymsg') })
})

router.get("/display", async (req, res) => {
    var allposts = await Post.find().sort({createdAt:-1})
    res.render("display", { posts: allposts, delResponse: req.flash('delmsg') })
})
//to be updated

router.get("/live/all", async (req, res) => {
    const allmatches = await MatchPost.find().sort({
        is_live: -1,
        match_date: -1,
    });
    if (allmatches) {
        res.render("live/managelive", { matches: allmatches, delResponse: req.flash('delmsg') })
    }
})

//path to editlive
router.get("/live/edit/:matchId", authcheak, async (req, res) => {

    const match = await MatchPost.findOne({firebase_match_id:req.params.matchId});
    match.timeline.sort(
        (a,b)=> {
            return (new Date(b.timeline_date) - new Date(a.timeline_date));
        }
    );
    if (match) {
        res.render("live/editlive", { matchData: match, editResponse: req.flash('editmsg') , notificationResponse: req.flash('notifymsg') })
    }
})


router.get("/post/edit/:postId", authcheak, async (req, res) => {
    let data = await Post.findById({ _id: req.params.postId })
    if (data) {
        res.render("Edit", { postData: data, editResponse: req.flash('editmsg') })
    }
})

module.exports =router;
