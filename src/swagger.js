const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definiše osnovne informacije o API-ju
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yettel API',
      version: '1.0.0',
      description: 'API dokumentacija ',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  // Gde se nalaze fajlovi sa komentarima za Swagger
  apis: ['./src/routes/*.js', './src/Model/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
