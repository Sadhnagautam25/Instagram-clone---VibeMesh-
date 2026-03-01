const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express(); // server is create now
app.use(express.json()); // server ab json format read kr skta h
app.use(cookieParser());
app.use(
  // ab server sbhi cors policy ko allow kr dega
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.static(path.join(__dirname, "public")));

// create routes prifix here ✅

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const followRouter = require("./routes/follow.routes");

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", followRouter);

//

// 🔥 Ye sabse LAST me hona chahiye
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
module.exports = app;
