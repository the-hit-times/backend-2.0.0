const express = require('express');
var flash = require('connect-flash');
const {authcheak} = require("../middleware/authcheak")
const Post = require('../mongoSchema/postSchema')
const router = express.Router();
const { convert } = require('html-to-text');



//createpost///////////////////////
router.post("/createpost", authcheak, (req, res) => {
    const html = req.body.body;
    const url = req.body.imgurl
    const text = convert(html, {
        wordwrap: 130
    });
    req.body['htmlBody'] = html;
    const new_post = new Post({
        title: req.body.title,
        description: req.body.description,
        body: text,
        link: url,
        dropdown: req.body.dropdown,
        htmlBody: html
    })
    new_post.save().then((result) => {
        if (result) {
            req.flash('postmsg', 'post added successfully')
            res.redirect("/pages/createpost")
        }
        else {
            req.flash('postmsg', 'post creation failed')
            res.redirect("/pages/createpost")
        }
    }).catch((err) => {
        req.flash('postmsg', 'post creation failed')
        res.redirect("/pages/createpost")
    })
})

//json data//////////////////////////////
router.get('/posts', async (req, res) => {
    const page = req.query.page
    const limit = req.query.limit;
    const start = (page - 1) * limit;
    const last = Number(start) + Number( limit)
    var allposts = await Post.find()
    if (page != null) {
        res.send(allposts.slice(start, last))
    }
    else {
        res.send(allposts)
    }

})



//delete post from db//////////////////////////
router.get("/post/del/:postId", authcheak, (req, res) => {
    Post.findByIdAndRemove({ _id: req.params.postId }, (err) => {
        if (!err) {
            req.flash('delmsg', 'post deleted successfully')
            res.redirect("/pages/display")
        }
        else {
            req.flash('delmsg', 'post delete failed')
            res.redirect("/pages/display")
        }
    })
})



//edited post save in db////////////////////
router.post("/post/edit/:tagtId", authcheak, async (req, res) => {

    req.body.updated_at = Date.now()
    const html = req.body.body;
    const url = req.body.imgurl
    const text = convert(html, {
        wordwrap: 130
    });
    req.body['htmlBody'] = html;

    const post = {
        title: req.body.title,
        description: req.body.description,
        body: text,
        link: url,
        dropdown: req.body.dropdown,
        htmlBody: html
    }

    if (req.body.body == '') {
        req.flash('editmsg', 'post update failed')
        res.redirect(`/pages/post/edit/${req.params.tagtId}`)
        return
    }
    await Post.findOneAndUpdate({ _id: req.params.tagtId }, post, (err) => {
        if (!err) {
            req.flash('editmsg', 'post updated successfully')
            res.redirect(`/pages/post/edit/${req.params.tagtId}`)
        }
        else {
            req.flash('editmsg', 'post update failed')
            res.redirect(`/pages/post/edit/${req.params.tagtId}`)
        }
    }).catch(err => {
        req.flash('editmsg', 'post update failed')
        res.redirect(`/pages/post/edit/${req.params.tagtId}`)
    })

})

module.exports = router