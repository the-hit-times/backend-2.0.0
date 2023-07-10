const express = require("express");
var flash = require("connect-flash");
const { authcheak } = require("../middleware/authcheak");
const Post = require("../mongoSchema/postSchema");
const router = express.Router();
const admin = require("firebase-admin");

const NOTIFICATION_TOPIC = "posts_notification";

router.post("/createpost", authcheak, async (req, res) => {
  try {
    await Post.create(req.body);
    req.flash("postmsg", "post added successfully");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    req.flash("postmsg", "post creation failed");
    res.status(200).send({ msg: err.message });
  }
});

router.post("/sendnotification", authcheak, async (req, res) => {
  try {
    const title = req.body.title.toString();
    const description = req.body.description.toString();
    const imageURL = req.body.link.toString();

    const payload = {
      notification: {
        title: title,
        body: description,
        image: imageURL,
      },
    };

    await admin.messaging().sendToTopic(
        NOTIFICATION_TOPIC, payload
    )

    req.flash("notifymsg", "sent notification successfully");
    res.status(200).send({msg: "success"});

  } catch (err) {
    req.flash("notifymsg", "sent notification failed");
    res.status(200).send({ msg: err.message });
  }
});

router.put("/post/edit/:tagtId", authcheak, async (req, res) => {
  try {
    await Post.findByIdAndUpdate({ _id: req.params.tagtId }, req.body);
    req.flash("editmsg", "post updated successfully");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    req.flash("editmsg", "post update failed");
    res.status(200).send({ msg: err.message });
  }
});

router.get("/post/del/:postId", authcheak, async (req, res) => {
  try {
    await Post.findByIdAndRemove({ _id: req.params.postId });
    req.flash("delmsg", "post deleted successfully");
    res.redirect("/pages/display");
  } catch (err) {
    req.flash("delmsg", "post delete failed");
    res.redirect("/pages/display");
  }
});

router.get("/posts", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(posts);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.get("/posts/weeklies", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const posts = await Post.find({ dropdown: { $nin: ["06", "07", "08"] } })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(posts);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.get("/posts/appx", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const posts = await Post.find({ dropdown: { $in: ["06", "07", "08"] } })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(posts);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.get("/posts/gazette", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const posts = await Post.find({ dropdown: { $in: ["09"] } })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(posts);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.get("/posts/reportopolis", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const posts = await Post.find({ dropdown: { $in: ["10"] } })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(posts);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

module.exports = router;
