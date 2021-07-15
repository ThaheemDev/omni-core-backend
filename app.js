const createError = require('http-errors'),
  express = require('express'),
  expressSession = require('express-session')({
    secret: process.env.SESSION_SECFRET || 'aebe58c5b60a8ec05d427a40220113ea218cc46455c10c84b55ec047',
    resave: false,
    saveUninitialized: false
    // TODO: save session into DB instead of MEM (Nabil)
  }),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  middleware = require('./middleware/index'),
  indexRouter = require('./routes/index'),
  bodyParser = require('body-parser'),
  db = require("./models"),
  authController = require('./controllers/auth'),
  swaggerJSDoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express');

db.sequelize.sync();
const app = express();

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
      url: 'http://localhost:3000',
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
app.use(expressSession);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


middleware(app)

app.use('/api', indexRouter);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

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