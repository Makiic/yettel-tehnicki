const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // putanja je iz src ka src/swagger.js
const routes = require('./routes');

const app = express();
app.use(express.json());

app.get('/api', (req, res) => res.send('API alive'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

module.exports = app;