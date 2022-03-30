const { PORT } = require('./helpers/env');
const app = require('./app');
const router = require('./routes');

// simple route
app.use('/', router);

// handling error route doesn't exist
app.use('/*', (req, res) => res.status(404).send('Path not found !'));

// set port, listen for requests
const port = PORT || 3001
app.listen(port, () => console.log(`Server running at port ${port}`));
