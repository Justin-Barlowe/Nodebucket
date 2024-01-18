// Name: Justin Barlowe
// Date: 01/18/2024
// Description: Mongo file for database connection for nodebucket
// File: mongo.js

"use strict"

// Import Mongo
const { MongoClient } = require('mongodb');

// Define connection string
const MONGO_URL = "mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.w2mknhu.mongodb.net/nodebucket?retryWrites=true&w=majority"

// Define mongo function
const mongo = async (operations, next) => {

  try {
    console.log('Connecting to database...');

    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = client.db('nodebucket');
    console.log('Connected to database');

    await operations(db);
    console.log('Operation was successful');

    client.close();
    console.log('Connection closed');

    // Error handling for database connection
  } catch (err) {
    const error = new Error('Application Error', err);
    error.status = 500;
    console.log("Error connecting to the database:", err);
  }
};

module.exports = { mongo };