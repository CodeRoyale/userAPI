// basic setting up
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
/* eslint-enable global-require */

const PORT = process.env.PORT || 5000;

// importing packages
const express = require('express');
const os = require('os');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

// connect to DB
(async () => {
  try {
    await mongoose.connect(
      /* eslint-disable */
      process.env.NODE_ENV !== 'test'
        ? process.env.DATABASE_URL || secrets.DATABASE_URL
        : process.env.TEST_DATABASE_URL,
      /* eslint-enable */
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log('Connected to database');
  } catch (error) {
    console.log('Failed to connect to database', error);
  }
})();

const app = express();

// middlewares
app.use(cookieParser());

const whitelist = ['http://localhost:3000', 'https://codeRoyale.herokuapp.com'];
const corsOptions = {
  origin: function (origin, callback) {
    // add !origin for services like postman
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // i dont like this it logs the shit
      // -can use customErrorHandler
      callback(new Error('Not allowed by CORS.'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/', require('./routes/main'));
app.use('/users', require('./routes/users'));
app.use('/token', require('./middlerwares/accessTokenGenerator'));

// start listening
const server = app.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server Started at ', host, ':', server.address().port);
});

// parameter for swaggerJSDoc to render the json for redoc
const options = {
  definition: {
    components: {},
    openapi: '3.0.0',
    info: {
      title: 'CodeRoyale API Documentation',
      version: 'v1.0.0',
      description:
        '<h3>Introduction</h3> <br/>The goal of CodeRoyale is to create Competitive Programming platform where users can have coding battle with friends, random users and team battles to show case your DSA skills.<hr/>',
    },
  },
  // Path to the files where API documentations are written
  apis: [path.resolve(__dirname, '../_docs/*.js')],
};

// passing option as a parameter to swaggerJSDoc
const swaggerSpec = swaggerJSDoc(options);

// request for getting the json file rendered by swaggerJSDocs
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// request for seeing the api-documentation live
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

module.exports = {
  server,
};
