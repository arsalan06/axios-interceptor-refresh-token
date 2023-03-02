const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  book: {
    filename: {
      type: String,
    },
    originalName: {
      type: String,
    },
    path: {
      type: String,
    },
    size: {
      type: Number,
    },
  },
  publishedDate: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
