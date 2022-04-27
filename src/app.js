const express = require('express');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const bodyParser = require('body-parser');
// const path = require('path');
const ejs = require('ejs');

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

// sanitize request data
app.use(xss());

// set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set express view engine
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

module.exports = app;
