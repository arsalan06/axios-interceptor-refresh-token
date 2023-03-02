const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ");
      let decoded = jwt.verify(token[1], process.env.JWT_SECRET);

      req.user = await User.findById(decoded._id).select("-password");

      next();
    }
  } catch (error) {
    res.status(401);
    next(new Error("Token authorization Failed!"));
  }

  if (!token) {
    res.status(401);
    next(new Error("Token authorization Failed!: Token not found"));
  }
});

module.exports = { protect };
