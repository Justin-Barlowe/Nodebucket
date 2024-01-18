// Title: app.js
// Author: Professor Krasso
// Date: 8/5/2023
// Modified by: Justin Barlowe
// Modified on: 1/18/2024
// Description: App.js file for Nodebucket

'use strict'

// Require statements
const express = require('express')
const createServer = require('http-errors')
const path = require('path')

// Set up swagger
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const YAML = require('yamljs')
// Relative path wouldn't work, had to use absolute, come back to this.
const swaggerDocument = YAML.load('C:/buwebdev/Nodebucket/server/api-test/employee.yaml')

const employeeRoute = require('./routes/employee')

// Create the Express app
const app = express()

// Swagger configuration options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Employee API',
      description: 'Employee API Information',
      contact: {
        name: 'Developer'
      },
      servers: ['http://localhost:3000']
    }
  },
  apis: ['./routes/employee.js']
}

// Configure swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configure the app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../dist/nodebucket')))
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')))

app.use("/api/employees", employeeRoute);

// error handler for 404 errors
app.use(function(req, res, next) {
  next(createServer(404)) // forward to error handler
})

// error handler for all other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500) // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})


// Export app
module.exports = app // export the Express application