const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    htmlBody: { type: String, required: true },
    link: { type: String, required: true },
    dropdown: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    c_image: { type: String, default: "noimage.jpg" }
}, { timestamps: true })

const Post = mongoose.model("post", postSchema)

module.exports = Post
