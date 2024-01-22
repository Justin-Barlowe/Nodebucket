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
const employeeRoute = require('./routes/employee')

// Create the Express app
const app = express()

// Swagger configuration options
const swaggerOptions ={
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Nodebucket API',
        version: '1.0.0',
        description: 'Employee API',
    }
},
 apis: ['./routes/*.js',
 path.join(__dirname, './api-test/employee.yaml')],
};

const openapiSpecification = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api-test', employeeRoute)


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