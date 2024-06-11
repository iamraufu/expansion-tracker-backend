const express = require("express");
const router = express.Router();

const {
  createActivityLog,
  getAllActivityLog,
  getAllActivityLogByType
} = require("../controllers/ActivityController");


router.post("/", getAllActivityLog);

router.post("/type", getAllActivityLogByType);

router.post("/create", createActivityLog);

// router.delete("/:id", deleteActivityLogById);


module.exports = router