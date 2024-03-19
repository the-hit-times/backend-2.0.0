const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
    {
        team_code: {
            type: String,
            required: true,
        },
        dept_name: {
            type: String,
            required: true,
        },
        football: {
            team_name: {
                type: String,
                required: true,
            },
            team_logo: {
                type: String,
                required: true,
            },
            players: [
                {
                    player_name: {
                        type: String,
                        required: true,
                    },
                    player_description: {
                        type: String,
                        required: true,
                    },
                    player_image: {
                        type: String,
                        required: true,
                    }
                }
            ]
        },
        cricket: {
            team_name: {
                type: String,
                required: true,
            },
            team_logo: {
                type: String,
                required: true,
            },
            players: [
                {
                    player_name: {
                        type: String,
                        required: true,
                    },
                    player_description: {
                        type: String,
                        required: true,
                    },
                    player_image: {
                        type: String,
                        required: true,
                    }
                }
            ]
        }
    }, {timestamps: true}
);

const Team = mongoose.model('team', teamSchema);

module.exports = Team;
