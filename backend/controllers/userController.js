const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const generateToken = require("../config/generateToken");

const User = require("../models/userModel");

//@description     Signup
//@route           POST /api/user/signup
//@access          Public
const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    res.status(401);
    next(new Error("Please Enter all the required fields"));
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(401);
    next(
      new Error("User with this email address already exists in the database!")
    );
  }

  const user = await User.create({
    username: username,
    email: email.toLowerCase(),
    password: password,
    role: role,
  });

  if (user) {
    res.status(200);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: role,
    });
  } else {
    res.status(401);
    next(new Error("User can not be created!"));
  }
});

//@description     Login
//@route           POST /api/user/login
//@access          Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401);
    next(new Error("Please enter Email and Password!"));
  }

  const user = await User.findOne({ email: email }).select("-_id,-password");

  if (user) {
    const validate = await user.isValidPassword(password);
    if (validate) {
      const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        role: user.role,
      };
      res.status(200).json(userData);
    } else {
      res.status(401);
      next(new Error("Invalid User Password!"));
    }
  } else {
    res.status(401);
    next(new Error("Invalid User Email"));
  }
});

//@description     Refreshes the token for the user
//@route           POST /api/user/refreshToken
//@access          Private

const refreshToken = (req, res, next) => {
  const user = req.body.user;
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(401);
    next(new Error("User not found!,Token not refreshed!"));
  }
};

module.exports = { signup, login, refreshToken };
