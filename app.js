var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/books');

const {sequelize} = require('./models/index');

app.use(express.static('public'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', usersRouter);


// MY 404

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404;
  err.message = "Sorry! We couldn't find the page you were looking for.";
  res.status(404).render('page-not-found', {err});
});

//global error handler

app.use(function(err, req, res, next) {
  if(err.status === 404){
    res.status(404).render('page-not-found', {err});
  } else {
    const status = err.status || 500;
    res.status(status);
    res.render('error', {err});
  }
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
