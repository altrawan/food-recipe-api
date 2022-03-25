require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const router = require('./src/helpers/router/router');

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.options('*', cors());
app.use(xss());
app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

app.use('/', router);

app.use('/*', (req, res) => res.status(404).send('Path not found !'));

app.listen(port, () => console.log(`Server running at port ${port}`));
