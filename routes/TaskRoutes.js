const express = require("express");
const router = express.Router();

const { tokenVerify } = require("../utilities/tokenVerify");

const {
  addTask,
  getAllTasks,
  getOneTask,
  updateTask,
} = require("../controllers/TaskController");

router.post("/create", addTask); // Create investor
router.post("/", getAllTasks); // get all
router.patch("/update/:id", updateTask); // update task
router.get("/:id", getOneTask); // get one

module.exports = router;
