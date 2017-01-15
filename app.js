var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var app = express();
var passport = require('passport');

// knex.insert({firstName: 'Tim'}).into('studentInfo');

//mongodb connection
// postgres://zvbsaaqbevecuo:ef87b554d97488e8d600b4d15c0acd38d02190ccd05006ae27211876e57459a3@ec2-107-22-236-252.compute-1.amazonaws.com:5432/d29nf9uuunnvne

mongoose.connect(process.env.mlab);
var db = mongoose.connection;

//mongo error
db.on('error', console.error.bind(console,'connection error'));

//sessions for tracking logis
// app.use(session({
//   secret: 'lokgical',
//   resave: true,
//   saveUninitialized: false,
//   store: new MongoStore({
//   mongooseConnection: db
//   })
// }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

//make user ID available in template

app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
})





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var routes = require('./routes/index');
app.use('/', routes);
//app.use('/users', users);
//var users = require('./routes/users');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000

// app.listen(3000, function () {

// });


app.listen(process.env.PORT || 3000, function () {
  console.log(process.env.PORT);
});

module.exports = app;
