var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const routes = require('./routes/index');
const books = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = createError(404, "Sorry! We couldn't find the page you were looking for.");
  next(err);
});

// global error handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(err.status)
    console.log(err.status, err.message);
    res.render('page-not-found', {err});
  } else {
    res.locals.message = err.message || "Sorry! There was an unexpected error on the server.";
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    console.log(err.status, err.message);
    res.render('error', {err});
  }
});

module.exports = app;