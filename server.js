const app = require('./app');
const { PORT } = require('./utility/config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const http = require('http');

// Create the HTTP server and bind it with the Express app
const server = http.createServer(app);

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chartworm API',
      version: '1.0.0',
      description: 'Chartworm API with MongoDB documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api/', require('./routes/users.routes'));
app.use('/api/', require('./routes/stocks.routes'));
app.use('/api/', require('./routes/stocksCSV.routes'));
app.use('/api/', require('./routes/tradeExplain.routes'));

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
