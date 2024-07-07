// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // Rutas donde se documentarán los endpoints
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
