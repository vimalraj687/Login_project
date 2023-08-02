const userModel = require("../model/userSchema");
const emailValidation = require("email-validator");
const bcrypt = require("bcrypt");
const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Every Field is reuired",
    });
  }

  const validEmail = emailValidation.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please Enter a valid Emails",
    });
  }
  //password valdation
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password not match",
    });
  }

  console.log(name, email, password, confirmPassword);

  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "alredy registered",
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// sign in
const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "every field is req..",
    });
  }

  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "invalid email or password",
      });
    }
    const token = user.jwtToken();
    user.password = undefined;
    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get user
const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// logout
const logout = (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOption);
    res.status(200).json({
      success: true,
      message: "Successfully Logout ",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signup, signin, getUser, logout };
