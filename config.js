const dotenv = require("dotenv").config();

const ENV = process.env.NODE_ENV;
const isDev = ENV === "DEV";
const PORT = isDev ? process.env.DEV_PORT : process.env.PORT;
const MONGO_URI = isDev
  ? process.env.MONGODB_URI_DEV
  : process.env.MONGODB_URI_PROD;
const GOOGLE_APPLICATION_CREDENTIALS = isDev ? process.env.GOOGLE_APPLICATION_CREDENTIALS_DEV : process.env.GOOGLE_APPLICATION_CREDENTIALS

console.log("MONGO_URI=>", MONGO_URI);
console.log("PORT=>", PORT);
module.exports = {
  ENV,
  PORT,
  MONGO_URI,
  GOOGLE_APPLICATION_CREDENTIALS
};
