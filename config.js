const dotenv = require("dotenv").config();

const ENV = process.env.NODE_ENV;
const isDev = ENV === "DEV";
const PORT = isDev ? process.env.DEV_PORT : process.env.PORT;
const MONGO_URI = isDev
  ? process.env.MONGODB_URI_DEV
  : process.env.MONGODB_URI_PROD;

console.log("MONGO_URI=>", MONGO_URI);
console.log("PORT=>", PORT);
module.exports = {
  ENV,
  PORT,
  MONGO_URI,
};
