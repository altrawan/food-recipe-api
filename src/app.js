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
app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

module.exports = app;
