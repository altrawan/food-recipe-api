const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const { APP_NAME, NODE_ENV, PORT } = require('./src/helpers/env');
const { failed } = require('./src/helpers/response');

const app = express();

app.use(express.json());

// enable cors
app.use(cors());
app.options('*', cors());

// set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// sanitize request data
app.use(xss());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// ejs
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Root Route
app.get('/', (req, res) =>
  res.send(`${APP_NAME} API - ${NODE_ENV[0].toUpperCase() + NODE_ENV.slice(1)}`)
);

// Main Route
app.use(require('./src/routes/auth.route'));
app.use(require('./src/routes/comment.route'));
app.use(require('./src/routes/likedRecipe.route'));
app.use(require('./src/routes/recipe.route'));
app.use(require('./src/routes/savedRecipe.route'));
app.use(require('./src/routes/user.route'));

// 404 Route
app.use((req, res) => {
  return failed(res, 404, 'failed', 'Resource on that url not found');
});

app.listen(PORT, () => {
  console.log(
    `Server running running at port ${PORT} with ${NODE_ENV} environment`
  );
});
