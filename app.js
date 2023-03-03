const express = require("express");
const getUser = require("./middleware/getUser");
const mongoose = require("mongoose");
const cookiParser = require("cookie-parser");
const bodyParser = require("body-parser");
var flash = require('connect-flash');
var session = require('express-session');

const dotenv = require("dotenv").config();
const admin = require("firebase-admin");
const NotificationManager = require("./Routes/notiyRoute");
const PostManager = require("./Routes/postRoute");
const PORT = process.env.PORT;
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS

const app = express()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

mongoose.connect(process.env.MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(res => {
    console.log("db connected")
}).catch(err => {
    console.log(err.message)
})


//app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({encoding: false}))
app.use(bodyParser.json())
app.use(cookiParser())
app.use(session({
    secret: "anakn", cookie: {expires: false},
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


//routes:
app.get("*", getUser)
app.use(require("./Routes/authRoute"))
app.use(require("./Routes/homeRoute"))
app.use(PostManager(admin))
app.use(NotificationManager(admin))


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
