var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var flash = require('connect-flash')

const headcountRoutes = require('./routes/headcount')
const authRoutes = require('./routes/auth')
const redirectIfAuthenticated = require('./middlewares/redirectIfAuthenticated')
const showHeadcountIfExist = require('./middlewares/showHeadcountIfExist')
const models = require('./models/index')

require("dotenv").config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my-badminton-secret',
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  },
  resave: false,
  saveUninitialized: true
}));
app.use(flash())

// store three flash variables as global variables in views
app.use((req, res, next) => {
  res.locals.messageSuccess = req.flash('messageSuccess')
  res.locals.messageFailure = req.flash('messageFailure')
  res.locals.validationFailure = req.flash('validationFailure')
  res.locals.oldForm = req.flash('oldForm')
  if (Array.isArray(res.locals.oldForm)) {
    res.locals.oldForm = res.locals.oldForm[0]
  }
  next();
})

app.use(authRoutes)
app.use(headcountRoutes)
app.get('/*', showHeadcountIfExist)
app.use('/', redirectIfAuthenticated);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

