require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

const router = require('./src/helpers/router/router');

const app = express();
const port = process.env.APP_PORT;

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
app.use(xss());
app.use(helmet());
app.use(compression());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/', router);

app.use('/*', (req, res) => res.status(404).send('Path not found !'));

app.listen(port, () => console.log(`Server running at port ${port}`));
