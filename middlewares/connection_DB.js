const mysql = require("mysql");

// CLIENT
const configDatabse = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// SERVER
// const configDatabse = {
//   host: "localhost",
//   user: "rakibwri_rakibwrites",
//   password: "#rakibWrites123@",
//   database: "rakibwri_blog_db",
// };

const conn = mysql.createConnection(configDatabse);

conn.connect(function (error) {
  if (error) {
    console.log("DB connection failed.");
  } else {
    console.log("DB conncetion success.");
  }
});

module.exports = conn;
