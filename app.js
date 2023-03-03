const express = require("express");
const getUser = require("./middleware/getUser");
const mongoose = require("mongoose");
const cookiParser = require("cookie-parser");
const bodyParser = require("body-parser");
var flash = require("connect-flash");
var session = require("express-session");
const dotenv = require("dotenv").config();
const routes = require("./routes/index");
const Post = require("./mongoSchema/postSchema");
const { ENV, PORT, MONGO_URI } = require("./config");

const app = express();

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

//app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ encoding: false }));
app.use(bodyParser.json());
app.use(cookiParser());
app.use(
  session({
    secret: "anakn",
    cookie: { expires: false },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

//routes:
app.get("*", getUser);
app.use(routes);

/*const change= async()=>{
  db.posts.updateMany({},{$rename:{"created_at":"createdAt","updated_at":"updatedAt"}})
  await Post.updateMany({},{$rename:{"created_at":"createdAt","updated_at":"updatedAt"}})
}*/

app.listen(PORT, () => {
  //change()
  console.log(`server is running on port ${PORT} in ${ENV} mode`);
});
