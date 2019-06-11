var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('3f0e1345-c648-4b7e-9db7-be49818612b2'));
app.use(session({
  secret: 'quiz-2015-ejc',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(methodOverride('_method'));

// Helpers dinamicos
app.use(function(req, res, next){
  // guardar path en session.redir para despues de login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  // hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// MW de auto-logout para controlar el tiempo de inactividad
app.use(function(req, res, next){
  // Solo si la sesión esta activa
  if(req.session.user){
    // Guardar la fecha/hora actual
    var now = new Date();
    
    // Calcular si han transcurrido más de 2 minutos desde la transacción anterior en la sesión
    if((now - new Date(req.session.datetimeLastTransaction)) > (2 * 60 * 1000)){
      // destruir la sesión
      delete req.session.user;
    }

    // Guardar la hora del reloj del sistema
    req.session.datetimeLastTransaction = now.toUTCString();
  }
  next();
});

app.use('/', routes);

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
      error: err, 
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}, 
    errors: []
  });
});


module.exports = app;
