const express = require("express");
const taskController = require("../Controllers/taskController");

const router = express.Router();

router
.route('/')
.post(taskController.TaskCreate)
.get(taskController.getAllTask);

router
.route('/:id')
.put(taskController.TaskUpdate)
.delete(taskController.TaskDelete)
.get(taskController.getTask);

module.exports = router;
