const express = require("express");
var flash = require("connect-flash");
const { authcheak } = require("../middleware/authcheak");
const Post = require("../mongoSchema/postSchema");
const router = express.Router();
const MatchPost = require("../mongoSchema/matchPostSchema");
const Team = require("../mongoSchema/teamSchema");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
const { GOOGLE_APPLICATION_CREDENTIALS } = require("../config");
initializeApp({
  credential: cert(GOOGLE_APPLICATION_CREDENTIALS),
});
const db = getFirestore();

const NOTIFICATION_POST = "posts_notification";
const NOTIFICATION_LIVE = "live_notification";
const matchPostFirebaseRef = db.collection("live_sessions");

router.post("/createpost", authcheak, async (req, res) => {
  try {
    const post = await Post.create(req.body);
    req.flash("postmsg", "post added successfully");
    res.status(200).send({ msg: "success", postId: post._id });
  } catch (err) {
    req.flash("postmsg", "post creation failed");
    res.status(200).send({ msg: err.message });
  }
});

router.post("/sendnotification", authcheak, async (req, res) => {
  try {
    const title = req.body.title.toString();
    const body = req.body.body.toString();
    const imageURL = req.body.link.toString();
    var postId = req.body.postId;
    var notificationType = "POST";

    if (postId == undefined) {
      postId = "";
    }

    const payload = {
      notification: {
        title: title,
        body: req.body.body.toString(),
        image: imageURL,
      },
      data: {
        postId: postId.toString(),
        type: notificationType,
      },
    };

    await getMessaging().sendToTopic(NOTIFICATION_POST, payload);

    req.flash("notifymsg", "sent notification successfully");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log(err);
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

router.get("/post/:tagtId", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.tagtId });
    res.status(200).send({ code: "success", data: post });
  } catch (err) {
    req.flash("editmsg", "post update failed");
    res.status(200).send({ msg: err.message });
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
    const posts = await Post.find({
      dropdown: { $nin: ["06", "07", "08", "09", "10"] },
    })
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

/**
 * APIs route for managing live matches.
 * */

//read live post
router.get("/live/match", async (req, res) => {
  try {
    const page =
      Number(req.query.page) - 1 <= 0 ? 0 : Number(req.query.page) - 1;
    const limit = Number(req.query.limit);
    const matchPost = await MatchPost.find()
      .sort({
        is_live: -1,
        match_date: -1,
      })
      .skip(page * limit)
      .limit(limit);
    res.send(matchPost);
  } catch (err) {
    res.send({ success: false, err: err.message });
  }
});

router.post("/live/notification/send", authcheak, async (req, res) => {
  try {
    const notificationType = "LIVE";
    const match_date = new Date(req.body.match_date);
    const notificationContent = {
      ...req.body,
      match_date: match_date,
    };
    const payload = {
      data: {
        type: notificationType,
        data: JSON.stringify(notificationContent),
      },
    };
    await getMessaging().sendToTopic(NOTIFICATION_LIVE, payload);
    req.flash("notifymsg", "success");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    req.flash("notifymsg", "failed");
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
      match_date: match_date,
    });

    await MatchPost.create({
      ...data,
      firebase_match_id: matchDocument.id,
      match_date: match_date,
      timeline: [],
    });
    res.status(200).send({ msg: "success", matchId: matchDocument.id });
  } catch (err) {
    req.flash("postmsg", "post creation failed");
    res.status(200).send({ msg: err.message });
  }
});

router.get("/live/match/:matchId", async (req, res) => {
  try {
    const doc = await MatchPost.findOne({
      firebase_match_id: req.params.matchId,
    });
    res.status(200).send({ data: doc, code: "success" });
  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

router.put("/live/match/:matchId", authcheak, async (req, res) => {
  try {
    const data = req.body;
    const match_date = new Date(data.match_date);
    const matchDocument = await matchPostFirebaseRef
      .doc(req.params.matchId)
      .set({
        ...data,
        match_date: match_date,
      });
    await MatchPost.findOneAndUpdate(
      { firebase_match_id: req.params.matchId },
      {
        ...data,
      },
    );
    res.status(200).send({ msg: "success", updateData: matchDocument });
  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

router.get("/live/match/:matchId/timeline", async (req, res) => {
  try {
    const data = await MatchPost.findOne({
      firebase_match_id: req.params.matchId,
    });
    data.timeline.sort((a, b) => {
      return -(new Date(a.timeline_date) - new Date(b.timeline_date));
    });
    res.status(200).send(data.timeline);
  } catch (err) {
    console.log(err);
    res.status(200).send({ msg: err.message });
  }
});

// insert a timeline in an MatchPost Object which
// is stored in an MongoDB
router.post("/live/match/:matchId/timeline", authcheak, async (req, res) => {
  try {
    const data = req.body;
    const match_date = new Date(data.timeline_date);
    const timelineFirebaseRef = await matchPostFirebaseRef
      .doc(req.params.matchId)
      .collection("timeline");

    const timelineDocument = await timelineFirebaseRef.add({
      ...data,
      timeline_date: match_date,
    });

    await MatchPost.updateOne(
      { firebase_match_id: req.params.matchId },
      {
        $push: {
          timeline: {
            ...data,
            timeline_date: match_date,
            firebase_timeline_id: timelineDocument.id,
          },
        },
      },
    );
    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(200).send({ msg: err.message });
  }
});

router.get("/live/count", async (req, res) => {
  try {
    const count = await MatchPost.find({ is_live: true }).countDocuments();
    res.status(200).send({ count: count });
  } catch (err) {
    res.status(200).send({ msg: err.message });
  }
});

router.delete(
  "/live/match/:matchId/timeline/:msgId/del",
  authcheak,
  async (req, res) => {
    try {
      const timelineFirebaseRef = await matchPostFirebaseRef
        .doc(req.params.matchId)
        .collection("timeline");
      await timelineFirebaseRef.doc(req.params.msgId).delete();

      await MatchPost.updateOne(
        { firebase_match_id: req.params.matchId },
        {
          $pull: {
            timeline: {
              firebase_timeline_id: req.params.msgId,
            },
          },
        },
      );
      res.status(200).send({ msg: "success" });
    } catch (err) {
      console.log(err);
      res.status(200).send({ msg: err.message });
    }
  },
);

//delete live post
router.get("/live/del/:matchId", authcheak, async (req, res) => {
  try {
    // batch delete all documents inside the sub collection 'timeline'
    const timelineFirebaseRef = await matchPostFirebaseRef
      .doc(req.params.matchId)
      .collection("timeline");
    const timelineDocs = await timelineFirebaseRef.get();
    const batch = db.batch();

    timelineDocs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.delete(matchPostFirebaseRef.doc(req.params.matchId));
    await batch.commit();
    await MatchPost.findOneAndDelete({ firebase_match_id: req.params.matchId });
    req.flash("delmsg", "post deleted successfully");
    res.redirect("/pages/live/all");
  } catch (err) {
    req.flash("delmsg", "post delete failed");
    res.redirect("/pages/live/all");
  }
});

/**
 * APIs route for managing team information such as
 * player name, player logo, etc. for specific games.
 */

router.post("/team/create", authcheak, async (req, res) => {
  try {
    const data = req.body;
    const teamDocument = await Team.create(data);
    res.status(200).send({ msg: "success", teamId: teamDocument.id });
  } catch (err) {
    req.flash("postmsg", "post creation failed");
    res.status(200).send({ msg: err.message });
  }
});

router.get("/team/:teamCode", async (req, res) => {
  try {
    const team = await Team.findOne({ team_code: req.params.teamCode });
    res.status(200).send({ code: "success", data: team });
  } catch (err) {
    req.flash("editmsg", "post update failed");
    res.status(200).send({ msg: err.message });
  }
});

router.put("/team/edit/:teamCode", authcheak, async (req, res) => {
  try {
    await Team.findOneAndUpdate({ team_code: req.params.teamCode }, req.body);
    req.flash("editmsg", "success");
    res.status(200).send({ msg: "success" });
  } catch (err) {
    req.flash("editmsg", "failed");
    res.status(200).send({ msg: err.message });
  }
});

router.post(
  "/team/edit/:teamCode/:matchType/player/add",
  authcheak,
  async (req, res) => {
    try {
      const matchType = req.params.matchType;
      const data = req.body;

      if (matchType == "cricket") {
        const teamDocument = await Team.findOneAndUpdate(
          { team_code: req.params.teamCode },
          {
            $push: {
              "cricket.players": {
                ...data,
              },
            },
          },
        );
        res.status(200).send({ msg: "success", updateData: teamDocument });
        return;
      }

      if (matchType == "football") {
        const teamDocument = await Team.findOneAndUpdate(
          { team_code: req.params.teamCode },
          {
            $push: {
              "football.players": {
                ...data,
              },
            },
          },
        );
        res.status(200).send({ msg: "success", updateData: teamDocument });
        return;
      }
      res.status(400).send({ msg: "Bad Request" });
    } catch (err) {
      console.log(err);
      res.status(200).send({ msg: err.message });
    }
  },
);

router.put(
  "/teams/:teamCode/:matchType/player/:playerId/edit",
  authcheak,
  async (req, res) => {
    try {
      const matchType = req.params.matchType;

      if (matchType == "football") {
        await Team.findOneAndUpdate(
          {
            team_code: req.params.teamCode,
            "football.players._id": req.params.playerId,
          },
          {
            $set: {
              "football.players.$": {
                ...req.body,
              },
            },
          },
        );
        res.status(200).send({ msg: "success" });
        return;
      }

      if (matchType == "cricket") {
        await Team.findOneAndUpdate(
          {
            team_code: req.params.teamCode,
            "cricket.players._id": req.params.playerId,
          },
          {
            $set: {
              "cricket.players.$": {
                ...req.body,
              },
            },
          },
        );
        res.status(200).send({ msg: "success" });
        return;
      }

      res.status(400).send({ msg: "Bad Request" });
    } catch (e) {
      console.log(e);
      res.status(200).send({ msg: e.message });
    }
  },
);

router.delete(
  "/teams/:teamCode/:matchType/player/:playerId/del",
  authcheak,
  async (req, res) => {
    try {
      const matchType = req.params.matchType;

      if (matchType == "football") {
        await Team.findOneAndUpdate(
          { team_code: req.params.teamCode },
          {
            $pull: {
              "football.players": {
                _id: req.params.playerId,
              },
            },
          },
        );
        res.status(200).send({ msg: "success" });
        return;
      }

      if (matchType == "cricket") {
        await Team.findOneAndUpdate(
          { team_code: req.params.teamCode },
          {
            $pull: {
              "cricket.players": {
                _id: req.params.playerId,
              },
            },
          },
        );
        res.status(200).send({ msg: "success" });
        return;
      }

      res.status(400).send({msg: "Bad Request"})
    } catch (e) {
      console.log(e);
      res.status(200).send({ msg: e.message });
    }
  },
);

router.get("/team/del/:teamCode", authcheak, async (req, res) => {
  try {
    await Team.findOneAndDelete({ team_code: req.params.teamCode });
    req.flash("delmsg", "post deleted successfully");
    res.redirect("/pages/team");
  } catch (err) {
    req.flash("delmsg", "post delete failed");
    res.redirect("/pages/team");
  }
});

module.exports = router;
