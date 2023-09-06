const express = require("express");
var flash = require("connect-flash");
const { authcheak } = require("../middleware/authcheak");
const Post = require("../mongoSchema/postSchema");
const router = express.Router();
const MatchPost = require("../mongoSchema/matchPostSchema");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const {GOOGLE_APPLICATION_CREDENTIALS} = require("../config");
initializeApp({
  credential: cert(GOOGLE_APPLICATION_CREDENTIALS),
})
const db = getFirestore();


const NOTIFICATION_POST = "posts_notification";
const NOTIFICATION_LIVE = "live_notification"
const matchPostFirebaseRef = db.collection("live_sessions");

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

    await getMessaging().sendToTopic(
        NOTIFICATION_POST, payload
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
    await MatchPost.findByIdAndRemove({ _id: req.params.postId });
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
    const posts = await Post.find({ dropdown: { $nin: ["06", "07", "08", "09", "10"] } })
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


//read live post
router.get("/managelive", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const timelinepost = await timelinepost.find()
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.send(timelinepost);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.post("/live/notification/send", authcheak, async (req, res) => {
  try {
    const notificationType = "LIVE";
    const match_date = new Date(req.body.match_date);
    const notificationContent =  {
      ...req.body,
      match_date:match_date
    }
    const payload = {
      data: {
        type:notificationType,
        data: JSON.stringify(notificationContent)
      },
    };
    await getMessaging().sendToTopic(
        NOTIFICATION_LIVE, payload
    )
    // req.flash("notifymsg", "sent notification successfully");
  console.log("Sending a notification!");
    res.status(200).send({msg: "success"});


  } catch (err) {
    // req.flash("notifymsg", "sent notification failed");
    console.log(err);
    res.status(200).send({ msg: err.message });
  }

});



//creating live post
router.post("/live/create", authcheak, async (req, res) => {
  try {
    const data = req.body;
    const match_date = new Date(data.match_date);
    const matchDocument = await matchPostFirebaseRef.add({
      ...data,
      match_date: match_date
    });

    await MatchPost.create({
        firebase_match_id: matchDocument.id,
        team1Code: data.team1.team_code,
        team2Code: data.team2.team_code,
        match_date: match_date,
        timeline: []
    });
    res.status(200).send({ msg: "success", matchId: matchDocument.id });
  } catch (err) {
    req.flash("postmsg", "post creation failed");
    res.status(200).send({ msg: err.message });
  }
});

//edit live post
router.put("/live/edit/:matchId", authcheak, async (req, res) => {
  try {
    await MatchPost.findByIdAndUpdate({ firbase_match_id: req.params.matchId}, req.body);
    req.flash("editmsg", "post updated successfully");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    req.flash("editmsg", "post update failed");
    res.status(200).send({ msg: err.message });
  }
});

router.get("/live/match/:matchId", authcheak, async (req, res) => {
  try {
    const doc = await matchPostFirebaseRef.doc(req.params.matchId).get();
    if (!doc.exists) {
      res.status(200).send({ msg: "No Such Match", code: "no_match" });
    }
    res.status(200).send({ data:doc.data() , code: "success" });

  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

router.put("/live/match/:matchId", authcheak, async (req, res) => {
  try {
    const data = req.body;
    const match_date = new Date(data.match_date);
    const matchDocument = await matchPostFirebaseRef.doc(req.params.matchId).set({
      ...data,
      match_date: match_date
    });
    res.status(200).send({ msg: "success", updateData: matchDocument });
  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

router.get("/live/match/:matchId/timeline", authcheak, async (req, res) => {
  try {
    const data = await MatchPost.findOne(
        { firebase_match_id: req.params.matchId}
    )
    data.timeline.sort(
        (a,b)=> {
          return -(new Date(a.timeline_date) - new Date(b.timeline_date))
        }
    );
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(200).send({ msg: err.message });
  }
});

// insert a timeline in an MatchPost Object which
// is stored in an MongoDB
router.post("/live/match/:matchId/timeline", authcheak, async (req, res) => {
  try {

    await MatchPost.updateOne(
        { firebase_match_id: req.params.matchId },
        {
          $push: {
            timeline: req.body,
          }
        },
    )

    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(200).send({ msg: err.message });
  }
});

router.delete("/live/match/:matchId/timeline/:msgId/del", authcheak, async (req, res) => {
  try {
    await MatchPost.updateOne(
        { firebase_match_id: req.params.matchId },
        {
          $pull: {
            timeline: {
              _id: req.params.msgId
            }
          }
        },
    )
    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(200).send({ msg: err.message });
  }
});

//delete live post
router.get("/live/del/:matchId", authcheak, async (req, res) => {
  try {
    await matchPostFirebaseRef.doc(req.params.matchId).delete();
    await MatchPost.findOneAndDelete({ firebase_match_id: req.params.matchId });
    req.flash("delmsg", "post deleted successfully");
    res.redirect("/pages/live/all");
  } catch (err) {
    req.flash("delmsg", "post delete failed");
    res.redirect("/pages/live/all");
  }
});


module.exports = router;
