const fs = require("fs");
const asyncHandler = require("express-async-handler");

const Book = require("../models/bookModel");

//@description     Add a new book
//@route           POST /api/book/add
//@access          author

const addBook = asyncHandler(async (req, res) => {
  const { title, description, publishedDate, authorId } = req.body;
  const bookFile = req.file;
  if (bookFile) {
    const book = await Book.create({
      title,
      description,
      publishedDate,
      authorId,
      book: {
        filename: bookFile.filename,
        originalName: bookFile.originalname,
        path: bookFile.path,
        size: bookFile.size,
      },
    });

    if (book) {
      res.status(201).json({ message: "Book Uploaded!", book });
    } else {
      res.status(401);
      next(new Error("Book is not uploaded!"));
    }
  }
});

//@description     Get all Books
//@route           POST /api/book/getBooks
//@access          public

const getBooks = asyncHandler(async (req, res, next) => {
  const books = await Book.find();
  if (books) {
    res.status(200).json(books);
  } else {
    res.status(401);
    next(new Error("Books are not retreived!"));
  }
});

//@description     Get a new book
//@route           GET /api/book/:filename
//@access          author, admin

const readBook = (req, res) => {
  const { filename } = req.params;
  const filePath = `uploads/books/${filename}`;
  const stat = fs.statSync(filePath);

  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${filename}`);

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

module.exports = { addBook, readBook, getBooks };
