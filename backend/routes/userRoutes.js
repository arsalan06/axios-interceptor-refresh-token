const { protect } = require("../middlewares/authMiddleware");
const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  refreshToken,
} = require("../controllers/userController");

//@description     Signup
//@route           POST /api/user/signup
//@access          Public
router.post("/signup", signup);

//@description     Login
//@route           POST /api/user/login
//@access          Public
router.post("/login", login);

//@description     Refreshes the token for the user
//@route           POST /api/user/refreshToken
//@access          Private
router.post("/refreshToken", refreshToken);

module.exports = router;
