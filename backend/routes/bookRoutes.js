const express = require("express");

const router = express.Router();
const { upload } = require("../middlewares/multerMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const {
  addBook,
  getBooks,
  readBook,
} = require("../controllers/bookController");

//@description     Add a new book
//@route           POST /api/book/add
//@access          author
router.post("/add", upload.single("file"), addBook);

//@description     Get all Books
//@route           POST /api/book/getBooks
//@access          public
router.get("/getBooks", protect, getBooks);

//@description     Get a new book
//@route           GET /api/book/:filename
//@access          author, admin
router.get("/readBook/:filename", readBook);

module.exports = router;
