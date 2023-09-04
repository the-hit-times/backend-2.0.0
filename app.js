const express = require("express");
const getUser = require("./middleware/getUser");
const mongoose = require("mongoose");
const cookiParser = require("cookie-parser");
const bodyParser = require("body-parser");
var flash = require("connect-flash");
var session = require("express-session");
const dotenv = require("dotenv").config();
const routes = require("./routes/index");
const cors = require("cors");
const { ENV, PORT, MONGO_URI, GOOGLE_APPLICATION_CREDENTIALS } = require("./config");

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

app.use(cors());
app.use(bodyParser.urlencoded({ encoding: false }));
app.use(express.static('public'));
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

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} in ${ENV} mode`);
});
