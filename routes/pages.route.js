const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const {authcheak,authcheakForsignin} = require("../middleware/authcheak")
const Post = require('../mongoSchema/postSchema')
const MatchPost = require('../mongoSchema/matchPostSchema')
const Team = require('../mongoSchema/teamSchema')


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


/** Pages Routes for Teams */
router.get("/teams/create", async (req, res) => {

    const teamToCode = {
        "100": "CSE",
        "101": "IT",
        "102": "ECE",
        "103": "AEIE",
        "104": "EE",
        "105": "MECH",
        "106": "CIVIL",
        "107": "CHEMICAL",
        "108": "BT/FT+AGL",
        "109": "CSE CS",
        "110": "CSE DS",
        "111": "CSE AIML",
        "112": "MASTERS",
    }
    // find all the team codes that does not have a team
    const allteams = await Team.find().sort({team_code:1});
    const allteamcodes = allteams.map(team => team.team_code);
    const teamcodes = Object.keys(teamToCode).filter(code => !allteamcodes.includes(code));

    const teams = teamcodes.map(code => {
        return {
            team_code: code,
            team_name: teamToCode[code]
        }
    })

    console.log(teams);

    res.render("teams/create_team", { teams: teams, teamResponse: req.flash('teammsg') })
});

router.get("/teams/manage", async (req, res) => {
    const allteams = await Team.find().sort({team_code:1});
    if (allteams) {
        res.render("teams/manage_teams", { teams: allteams, delResponse: req.flash('delmsg') })
    }
});

router.get("/teams/edit/:teamId/football", authcheak, async (req, res) => {
    const team = await Team.findOne({ team_code: req.params.teamId });
    if (team) {
        res.render("teams/edit_team_football", { teamData: team, editResponse: req.flash('editmsg') })
    }
});
router.get("/teams/edit/:teamId/cricket", authcheak, async (req, res) => {
    const team = await Team.findOne({ team_code: req.params.teamId });
    if (team) {
        res.render("teams/edit_team_cricket", { teamData: team, editResponse: req.flash('editmsg') })
    }
});

module.exports =router;
