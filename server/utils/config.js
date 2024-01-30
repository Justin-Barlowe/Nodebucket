// Name: Justin Barlowe
// Date: 01/29/2024
// File: config.js
// Description: Configuration file for MongoDB connection login information.

"use strict"

const db  = {
  username:"nodebucket_user",
  password:"s3cret",
  name:"nodebucket"
};

const config = {
  port: 3000,
  dbUrl: `mongodb+srv://${db.username}:${db.password}@bellevueuniversity.w2mknhu.mongodb.net/${db.name}?retryWrites=true&w=majority`,
  dbname: db.name
};

module.exports = config;