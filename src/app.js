const express = require('express');
const app = express();
const routes = require('./routes/index');
const { swaggerUi, swaggerDocs } = require('./swagger'); // putanja do swagger.js

app.use(express.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
module.exports = app;
