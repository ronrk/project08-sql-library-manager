var express = require("express");
const res = require("express/lib/response");
const app = require("../app");
var router = express.Router();

const Book = require("../db/models").Book;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

const books =
  /* GET home page. */
  router.get("/", (req, res) => res.redirect("/books"));
router.get("/books", (req, res) => res.render("index", { title: "hello" }));
router.get("/books/new", (req, res) => res.render("new-book"));
router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/books");
  })
);
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book });
  })
);
router.post("/books/:id", (req, res) => res.render("index"));
router.post("/books/:id/delete", (req, res) => res.render("index"));

module.exports = router;
