const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const atuhRouter = require("./routes/auth.route");
const postsRouter = require("./routes/posts.route");
const app = express();

// SET ALL PERSERS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable('x-powered-by'); // less hacker Attack

// SET PUBLIC FOLDER ("./public");
// app.use(express.static("./public"));
app.use('/public', express.static(path.join(__dirname, './public')))

// USER CORS
app.use(
  cors({
    origin: [
      "https://rakib-blog-frontend.netlify.app",
      process.env.FRONTEND_URL,
      "https://frontend-next-js-blog.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// ALL ROUTS
app.use("/api/auth", atuhRouter);
app.use("/api/post", postsRouter);

// NOT FOUND URL
app.use("/*", (req, res, next) => {
  next("URL not found!");
});

// Default ERROR HANDER
app.use((err, req, res, next) => {
  if (err.headerSent) {
    next("There was a problem!");
  } else {
    if (err) {
      res.status(500).json({
        status: "error",
        message: err,
      });
    } else {
      console.log("ER: ", err);
      res.status(500).json({
        status: "error",
        message: "Internal Error!",
      });
    }
  }
});

module.exports = app;
