const mongoose = require("mongoose")

const matchPostSchema = new mongoose.Schema(
    {
        firebase_match_id: {
            type: String,
            required: true
        },
        team1: {
            team_code: {
                type: String,
                required: true,
            },
            team_score: {
                type: String,
                required: true,
            },
            team_penalty: {
                type: String,
                default: "0"
            }
        },
        team2: {
            team_code: {
                type: String,
                required: true,
            },
            team_score: {
                type: String,
                required: true,
            },
            team_penalty: {
                type: String,
                default: "0"
            }
        },
        is_live: {
            type: Boolean,
            required: true,
        },
        match_status: {
            type: String,
            required: true,
        },
        match_type: {
            type: String,
            required: true,
        },
        match_date: {
            type: Date,
            required: true
        },
        timeline: [
            {
                firebase_timeline_id: {
                    type: String,
                    required: true
                },
                timeline_date: {
                    type: Date
                },
                msgHtml: {
                    type: String
                }
            }
        ]
    }, {timestamps: true})


const MatchPost = mongoose.model("matchpost", matchPostSchema);

module.exports = MatchPost;