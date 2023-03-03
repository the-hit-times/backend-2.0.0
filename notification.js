const dotenv=require("dotenv").config()
const admin = require("firebase-admin");

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const payload = {
    notification: {
        title: 'New Puppy!',
        body: `Sam is ready for adoption`,
    }
};

/*admin.messaging().sendToDevice(
 "cJdqp3VoTya8KEnZBNEnyT:APA91bHrYIjCKruZcfjdo-4V_2D5GqpRQPC_oubpCwoK19Rar8jrfE3kxEyxvtYNFUOhKwimVS7Nj_nUrU5hGfAz3Z_wzop_36eRE4szaJ2jPwT00iIbHVmzWq-bEoVBYoqgGy2TLCbT", payload

    ).then((response)=> {
    console.log(response)
})*/

admin.messaging().sendToTopic(

    "events_notification", payload
).then((response)=> {
    console.log(response)
})
