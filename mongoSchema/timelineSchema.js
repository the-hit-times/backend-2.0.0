const mongoose = require("mongoose")

const timelineSchema = new mongoose.Schema(
    {

        firbase_match_id: {
            type: String,
            required:true
        }, 
        
        timeline: [{
                timeline_date : {
                    type: String
                }, 
                msg:{
                    type:String
                }
            }
            ]
            
},{timestamps:true})



const timelinepost = mongoose.model("timelinepost", timelineSchema)

module.exports = timelinepost;