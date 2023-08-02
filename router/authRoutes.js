const express = require("express");
const {
  signup,
  signin,
  getUser,
  logout,
} = require("../controller/authControllers");
const jwtAuth = require("../controller/jwtAuth");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

module.exports = authRouter;
