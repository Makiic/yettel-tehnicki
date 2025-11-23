// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Yettel Tasks API',
      version: '1.0.0',
      description:
        'REST API za korisnike i taskove. Uloge: basic (samo sopstveni taskovi) i admin (vidi/menja sve).',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['basic', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserCreate: {
          type: 'object',
          required: ['firstName', 'lastName', 'username', 'email', 'password'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['basic', 'admin'] },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        LoginRequest: {
          oneOf: [
            {
              type: 'object',
              required: ['username', 'password'],
              properties: {
                username: { type: 'string' },
                password: { type: 'string' },
              },
            },
            {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
              },
            },
          ],
        },
        TokenResponse: {
          type: 'object',
          properties: { token: { type: 'string' } },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            body: { type: 'string' },
            ownerId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TaskCreate: {
          type: 'object',
          required: ['body'],
          properties: { body: { type: 'string' } },
        },
        TaskUpdate: {
          type: 'object',
          required: ['body'],
          properties: { body: { type: 'string' } },
        },
        PaginatedTasks: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 25 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
      },
      parameters: {
        PageParam: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1 },
          required: false,
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 100 },
          required: false,
        },
        SortByParam: {
          in: 'query',
          name: 'sortBy',
          schema: { type: 'string', enum: ['createdAt', 'updatedAt'] },
          required: false,
        },
        OrderParam: {
          in: 'query',
          name: 'order',
          schema: { type: 'string', enum: ['asc', 'desc'] },
          required: false,
        },
        IdPathParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          summary: 'Registracija korisnika',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'Korisnik kreiran',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            400: { description: 'Validacija nije prošla' },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Prijava',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Token dobijen',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TokenResponse' },
                },
              },
            },
            401: { description: 'Neispravni kredencijali' },
          },
        },
      },
      '/users/me': {
        get: {
          summary: 'Moj profil',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          summary: 'Ažuriraj moj profil',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserUpdate' },
              },
            },
          },
          responses: {
            200: {
              description: 'Ažurirano',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users': {
        get: {
          summary: 'Lista korisnika (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SortByParam' },
            { $ref: '#/components/parameters/OrderParam' },
          ],
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
      },
      '/users/{id}': {
        put: {
          summary: 'Ažuriraj bilo kog korisnika (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserUpdate' },
              },
            },
          },
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
      },
      '/tasks': {
        get: {
          summary: 'Lista svih taskova (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SortByParam' },
            { $ref: '#/components/parameters/OrderParam' },
          ],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedTasks' },
                },
              },
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
          },
        },
        post: {
          summary: 'Kreiraj task (basic/admin - svoj)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'Kreirano',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/tasks/mine': {
        get: {
          summary: 'Moji taskovi (basic/admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' },
            { $ref: '#/components/parameters/SortByParam' },
            { $ref: '#/components/parameters/OrderParam' },
          ],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedTasks' },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/tasks/{id}': {
        put: {
          summary: 'Ažuriraj svoj task (basic/admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskUpdate' },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Task' },
                },
              },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
      },
      '/tasks/{id}/admin': {
        put: {
          summary: 'Ažuriraj bilo koji task (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: '#/components/parameters/IdPathParam' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskUpdate' },
              },
            },
          },
          responses: {
            200: { description: 'OK' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' },
            404: { description: 'Not found' },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);