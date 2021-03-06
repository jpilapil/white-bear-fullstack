require("dotenv").config();
const nodeUtil = require("util");
const mysql = require("mysql");

const db = mysql.createPool({
  // pool of connections connected to database
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: "white_bear_app",
});

db.query = nodeUtil.promisify(db.query);

module.exports = db;
