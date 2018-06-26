// server/app.js
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import store from 'connect-pg-simple';
import path from 'path';

import router from './api';

// setup express and sessions
const app = express();
const pgSession = store(session);

app.use(
  session({
    store: new pgSession({
      conString: `postgres://postgres:postgres@localhost:5432/dronedb`
    }),
    secret: 'dronedb',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);

// for CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,UPDATE,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// setup logger
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //json parser

// serve static assets
app
  .use(express.static(path.resolve(__dirname, '..', 'build')))
  // Serve our api
  .use(router);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});

export default server;
