const express = require("express");
const router = express.Router();
const book = require("./../controllers/bookController");
const author = require("./../controllers/authorController");


//router for books
router
.route("/book/")
.get(book.GetAllBooks)
.post(book.CreateBook);

router
.route("/book/:id")
.get(book.GetBook)
.patch(book.UpdateBook)
.delete(book.DeleteBook);

//router for authors
router
.route("/author/")
.get(author.GetAllAuthors)
.post(author.CreateAuthor);

router
.route("/author/:id")
.get(author.GetAuthor)
.patch(author.UpdateAuthor)
.delete(author.DeleteAuthor);

module.exports = router;