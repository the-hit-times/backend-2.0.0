const express = require('express');
var flash = require('connect-flash');
const authcheak = require("../middleware/authcheak")
const Post = require('../mongoSchema/postSchema')
const Router = express.Router();
const {convert} = require('html-to-text');

const PostManager = (admin) => {

    const NOTIFICATION_TOPIC = "posts_notification"

    //postview///////////////////////////
    Router.get("/posts", authcheak.authcheak, (req, res) => {
        res.render("post", {postResponse: req.flash('postmsg')})
    })

    //createpost///////////////////////
    Router.post("/createpost", authcheak.authcheak, (req, res) => {
        const html = req.body.body;
        const url = req.body.imgurl
        const text = convert(html, {
            wordwrap: 130
        });
        req.body['htmlBody'] = html;
        console.log(req.body);
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

                const payload = {
                    notification: {
                        title: req.body.title.toString(),
                        body: req.body.description.toString(),
                        image: url
                    },
                };

                admin.messaging().sendToTopic(
                    NOTIFICATION_TOPIC, payload
                ).then((response) => {
                    req.flash('postmsg', "notification_send")
                }).catch((error) => {
                    req.flash('postmsg', "notification_error")
                })
                res.redirect("/posts")
            } else {
                req.flash('postmsg', 'post creation failed')
                res.redirect("/posts")
            }
        }).catch((err) => {
            req.flash('postmsg', 'post creation failed')
            res.redirect("/posts")
            console.log(err);
        })
    })

    //json data//////////////////////////////
    Router.get('/api/posts', async (req, res) => {
        const page = req.query.page
        const limit = req.query.limit;
        const start = (page - 1) * limit;
        const last = Number(start) + Number(limit)
        console.log(start, last);
        var allposts = await Post.find()
        if (page != null) {
            res.send(allposts.slice(start, last))
        } else {
            res.send(allposts)
        }

    })

    //get all posts in display section/////////////////////////
    Router.get("/display", async (req, res) => {
        var allposts = await Post.find()
        res.render("display", {posts: allposts, delResponse: req.flash('delmsg')})
    })

    //delete post from db//////////////////////////
    Router.get("/post/del/:postId", authcheak.authcheak, (req, res) => {
        Post.findByIdAndRemove({_id: req.params.postId}, (err) => {
            if (!err) {
                req.flash('delmsg', 'post deleted successfully')
                res.redirect("/display")
            } else {
                req.flash('delmsg', 'post delete failed')
                res.redirect("/display")
            }
        })
    })

    //edit post view/////////////////////////////
    Router.get("/post/edit/:postId", authcheak.authcheak, async (req, res) => {
        let data = await Post.findById({_id: req.params.postId})
        if (data) {
            res.render("Edit", {postData: data, editResponse: req.flash('editmsg')})
        }
    })

    //edited post save in db////////////////////
    Router.post("/post/edit/:tagtId", authcheak.authcheak, async (req, res) => {

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
            res.redirect(`/post/edit/${req.params.tagtId}`)
            return
        }
        await Post.findOneAndUpdate({_id: req.params.tagtId}, post, (err) => {
            if (!err) {
                req.flash('editmsg', 'post updated successfully')
                res.redirect(`/post/edit/${req.params.tagtId}`)
            } else {
                req.flash('editmsg', 'post update failed')
                res.redirect(`/post/edit/${req.params.tagtId}`)
            }
        }).catch(err => {
            req.flash('editmsg', 'post update failed')
            res.redirect(`/post/edit/${req.params.tagtId}`)
        })

    })

    return Router
}

module.exports = PostManager