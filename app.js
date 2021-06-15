const createError = require('http-errors'),
          express = require('express'),
          path = require('path'),
          cookieParser = require('cookie-parser'),
          logger = require('morgan'),
          middleware = require('./middleware/index'),
          indexRouter = require('./routes/index'),
          bodyParser = require('body-parser'),
          db = require("./models");


db.sequelize.sync();

const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


middleware(app)

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
