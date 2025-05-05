const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Management API',
      version: '1.0.0',
      description: 'API documentation for Restaurant Management System',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone'],
          properties: {
            name: {
              type: 'string',
              description: 'User\'s full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            password: {
              type: 'string',
              description: 'User\'s password'
            },
            phone: {
              type: 'string',
              description: 'User\'s phone number'
            },
            role: {
              type: 'string',
              enum: ['admin', 'owner', 'staff'],
              default: 'staff',
              description: 'User\'s role'
            }
          }
        },
        Menu: {
          type: 'object',
          required: ['name', 'category', 'price', 'restaurant'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the menu item'
            },
            category: {
              type: 'string',
              description: 'Category of the menu item'
            },
            price: {
              type: 'number',
              description: 'Price of the menu item'
            },
            description: {
              type: 'string',
              description: 'Description of the menu item'
            },
            image: {
              type: 'string',
              description: 'URL of the menu item image'
            },
            restaurant: {
              type: 'string',
              description: 'ID of the restaurant'
            },
            items: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of items in the menu'
            }
          }
        },
        Table: {
          type: 'object',
          required: ['number', 'capacity', 'restaurant'],
          properties: {
            number: {
              type: 'number',
              description: 'Table number'
            },
            capacity: {
              type: 'number',
              description: 'Maximum number of people the table can accommodate'
            },
            status: {
              type: 'string',
              enum: ['available', 'occupied', 'reserved'],
              default: 'available',
              description: 'Current status of the table'
            },
            restaurant: {
              type: 'string',
              description: 'ID of the restaurant'
            }
          }
        },
        Reservation: {
          type: 'object',
          required: ['customerName', 'date', 'time', 'guests', 'table'],
          properties: {
            customerName: {
              type: 'string',
              description: 'Name of the customer making the reservation'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of the reservation'
            },
            time: {
              type: 'string',
              format: 'time',
              description: 'Time of the reservation'
            },
            guests: {
              type: 'number',
              description: 'Number of guests'
            },
            table: {
              type: 'string',
              description: 'ID of the reserved table'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              default: 'pending',
              description: 'Status of the reservation'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 