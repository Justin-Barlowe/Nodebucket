// Name: Justin Barlowe
// File: employee.js
// Date: 01/18/2024
// Modified: 01/22/2024
// Description: Employee API

"use strict";

// Require statements
const express = require("express");
const router = express.Router();
const { mongo } = require("../utils/mongo");
const Ajv = require("ajv");
const { ObjectId } = require("mongodb");

const ajv = new Ajv();

// AJV schema for validating request body
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

// Tasks schema for validation

const tasksSchema = {
  type: "object",
  required: ["todo", "done"],
  additionalProperties: false,
  properties: {
    todo: {
      type: "array",
      items: {
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
        },
        required: ["_id", "text"],
        additionalProperties: false,
      },
    },
    done: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
        },
        required: ["_id", "text"],
        additionalProperties: false,
      },
    },
  },
};

// Get employee by empId
router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Error handling for invalid employee ID
    if (isNaN(empId)) {
      const err = new Error("Employee ID must be a number");
      err.status = 400;
      console.log(err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      // Error handling for employee not found
      if (!employee) {
        const err = new Error("Employee not found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      res.send(employee);
    });
  } catch (err) {
    console.error("Error: ".err);
    next(err);
  }
});

// Get all employees, added for swagger and soap testing.
router.get("/", (req, res, next) => {
  try {
    mongo(async (db) => {
      const employees = await db.collection("employees").find().toArray();
      res.send(employees);
    });
  } catch (err) {
    console.error("Error: ", err);
    next(err);
  }
});

//Employee tasks API
router.get("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    if (isNaN(empId)) {
      const err = new Error("Employee ID must be a number");
      err.status = 400;
      console.log(err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ empId }, { projection: { empId: 1, todo: 1, done: 1 } });

      //Return error if no tasks found.
      if (!employee) {
        const err = new Error("Unable to find employee for empId: " + empId);
        err.status = 404;
        console.error("err", err);
        next(err);
        return;
      }

      // Return tasks if no error.
      res.send(employee);
    }, next);
  } catch (err) {
    console.error("Error: ", err);
    next(err);
  }
});

// Create tasks API
router.post("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Error handling for invalid employee ID
    if (isNaN(empId)) {
      const err = new Error("Employee ID must be a number");
      err.status = 400;
      console.error("err", err);
      next(err);
      return;
    }

    // Error handling for request body.
    const { text } = req.body;
    const validator = ajv.compile(taskSchema);
    const isValid = validator({ text });

    // Error handling for invalid request body.
    if (!isValid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });
      if (!employee) {
        const err = new Error("Employee not found");
        err.status = 404;
        console.error("err", err);
        next(err);
        return;
      }

      const task = {
        _id: new ObjectId(),
        text,
      };

      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $push: { todo: task } });

      if (!result.modifiedCount) {
        const err = new Error("Unable to add task for empId: " + empId);
        err.status = 500;
        console.error("err", err);
        next(err);
        return;
      }

      res.status(201).send({ id: task._id });
    }, next);
  } catch (err) {
    console.error("Error: ", err);
    next(err);
  }
});

// Update tasks API
router.put("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);
    console.log("empId", empId);

    // Error handling for invalid employee ID
    if (isNaN(empId)) {
      const err = new Error("Employee ID must be a number");
      err.status = 400;
      console.error("err", err);
      next(err);
      return;
    }

    const validator = ajv.compile(tasksSchema);
    const isValid = validator(req.body);

    // Error handling for invalid request body.
    if (!isValid) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });
      if (!employee) {
        const err = new Error("Employee not found");
        err.status = 404;
        console.error("err", err);
        next(err);
        return;
      }

      const result = await db
        .collection("employees")
        .updateOne(
          { empId },
          { $set: { todo: req.body.todo, done: req.body.done } }
        );
      // No record updated, return 404 status code.
      if (!result.modifiedCount) {
        const err = new Error("Unable to update tasks for empId: " + empId);
        err.status = 500;
        console.error("err", err);
        next(err);
        return;
      }
      res.status(204).send();
    }, next);
  } catch (err) {
    console.error("Error: ", err);
    next(err);
  }
});

// Delete tasks API

router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  try {
    let { empId, taskId } = req.params;
    empId = parseInt(empId, 10);

    // Error handling for invalid employee ID
    if (isNaN(empId)) {
      const err = new Error("Employee ID must be a number");
      err.status = 400;
      console.error("err", err);
      next(err);
      return;
    }

    mongo(async (db) => {
      let employee = await db.collection("employees").findOne({ empId });

      if (!employee) {
        const err = new Error("Employee not found");
        err.status = 404;
        console.error("err", err);
        next(err);
        return;
      }

      if (!employee.todo) employee.todo = [];
      if (!employee.done) employee.done = [];

      const todo = employee.todo.filter(
        (task) => task._id.toString() !== taskId.toString()
      );
      const done = employee.done.filter(
        (task) => task._id.toString() !== taskId.toString()
      );

      // Update the employee record with new todo and done arrays.
      const result = await db
        .collection("employees")
        .updateOne({ empId }, { $set: { todo: todo, done: done } });

      res.status(204).send();
    }, next);
  } catch {
    console.error("Error: ", err);
    next(err);
  }
});

// Export router
module.exports = router;
