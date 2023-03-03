const express = require('express');
const Router = express.Router();
const flash = require('connect-flash');
const authcheak = require("../middleware/authcheak")
const admin = require("firebase-admin");


const NotificationManager = (admin) => {

    const NOTIFICATION_TOPIC = "events_notification"

    Router.get("/notify", authcheak.authcheak, (req, res) => {
        res.render("notify", {notifyResponse: req.flash('notifymsg')})
    })

    Router.post("/sendnotification", authcheak.authcheak, (req, res) => {

        const payload = {
            notification: {
                title: req.body.title.toString(),
                body: req.body.description.toString(),
                image: req.body.imgurl.toString()
            },
        };

        admin.messaging().sendToTopic(
            NOTIFICATION_TOPIC, payload
        ).then((response) => {
            req.flash('notifymsg', "notification_send")
            res.redirect("/notify")
        }).catch((error) => {
            req.flash('notifymsg', "notification_error")
            res.redirect("/notify")
        })
    })


    return Router
}

module.exports = NotificationManager