var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
var router = express.Router();

//import the Book module
const Book = require("../models").Book;

//IIFE helper function
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/* GET home page. redirect to /books */
router.get("/", (req, res) => {
  res.redirect("/books");
});

//get /books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { title: "Books Library Manager", books });
  })
);

//render the new-book page
router.get("/books/new", (req, res) =>
  res.render("new-book", { title: "Create New Book" })
);

//post the New book and redirect to /books
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", { errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

//render update-book page depend on req.params.id
router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: `${book.title}- Update Book` });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = '"Book.id" is not valid or not exist';
      next(err);
    }
  })
);

//post for the update method
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          errors: error.errors,
          book,
          title: book.title,
        });
      } else {
        throw error;
      }
    }
  })
);

//post for the delete method
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

module.exports = router;
