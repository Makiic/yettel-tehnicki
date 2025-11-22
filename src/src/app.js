const express = require('express');
const app = express();
const routes = require('./routes/index');

// middlewares
app.use(express.json());   // da parsira JSON body

// routes
app.use('/api', routes);

// exportujemo app da ga server.js koristi
module.exports = app;
