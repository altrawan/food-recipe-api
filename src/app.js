const express = require('express');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// sanitize request data
app.use(xss());

// set security HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}));

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

module.exports = app;
