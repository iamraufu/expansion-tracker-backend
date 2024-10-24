const express = require("express");
const router = express.Router();
const BenchmarkOutletsController = require("../controllers/BenchmarkOutletsController");
const { tokenVerify } = require('../utilities/tokenVerify')

// Route for getting outlets by cluster
router.post("/cluster",tokenVerify, BenchmarkOutletsController.getByCluster);

// Route for getting all outlets
router.get("/",tokenVerify, BenchmarkOutletsController.getAllOutlets);

module.exports = router;
