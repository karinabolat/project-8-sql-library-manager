var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const Book = require('../models').Book;

// Handler function to wrap each route.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('books/index', {books});
}));

/* Create a new book. */
router.get('/new', (req, res) => {
  res.render('books/new-book', {book: {}});
});

/* POST a new book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

/* GET a book. */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", { book });
  } else {
    const err = createError(404, "Sorry! We couldn't find the book you are looking for.");
    next(err);
  } 
}));

/* POST update a book. */
router.post('/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = createError(404, "Sorry! We couldn't find the book you are looking for.");
      next(err);
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

/* Delete a book */
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    const err = createError(404, "Sorry! We couldn't find the book you are looking for.");
    next(err);
  }
}));

module.exports = router;
