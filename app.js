const express = require("express");
const app = express();
const authRouter = require("./router/authRoutes");
const databaseconnect = require("./config/dbConfig");
const cookieParser = require("cookie-parser");
const cors = (require = require("cors"));

databaseconnect();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
//coockie parser
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.use("/", (req, res) => {
  res.status(200).json({ data: "JWTauth server server updated" });
});
module.exports = app;
