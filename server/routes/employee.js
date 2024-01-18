// Name: Justin Barlowe
// File: employee.js
// Date: 01/18/2024
// Description: Employee API


"use strict"

// Require statements
const express = require('express');
const router = express.Router();
const { mongo } = require('../utils/mongo');


// Get employee by empId
router.get("/:empId",  (req, res, next) => {
  try{
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Error handling for invalid employee ID
    if (isNaN(empId)) {
      const err = new Error('Employee ID must be a number');
      err.status = 400;
      console.log(err);
      next(err);
      return;
    }

    mongo(async db => {
      const employee = await db.collection('employees').findOne({ empId });

      // Error handling for employee not found
      if (!employee) {
        const err = new Error('Employee not found');
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      res.send(employee);
    });
  }
  catch(err) {
  console.error("Error: ". err);
  next(err);
  }
})

// Get all employees, added for swagger and soap testing.
router.get("/", (req, res, next) => {
  try{
    mongo(async db => {
      const employees = await db.collection('employees').find().toArray();
      res.send(employees);
    });
  }
  catch(err) {
    console.error("Error: ", err);
    next(err);
  }
})


// Export router
module.exports = router;