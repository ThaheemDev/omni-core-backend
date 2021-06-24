const createError = require('http-errors'),
          express = require('express'),
          path = require('path'),
          cookieParser = require('cookie-parser'),
          logger = require('morgan'),
          middleware = require('./middleware/index'),
          indexRouter = require('./routes/index'),
          bodyParser = require('body-parser'),
          db = require("./models"),
          swaggerJSDoc = require('swagger-jsdoc'),
          // passport = require('passport'),
          swaggerUi = require('swagger-ui-express');
const user = require('./models/user');
       


db.sequelize.sync();

const app = express();
// const initializePassport = require('./passport-config');
// initializePassport(passport,email=>user.find(userObj=>userObj.email == email));



const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Account Management API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'accountmanagement',
      url: '',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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