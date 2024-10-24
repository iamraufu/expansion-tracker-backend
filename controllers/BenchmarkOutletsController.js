const BenchMarkOutletsModel = require("../models/BenchMarkOutletsModel");

// Get by Cluster
exports.getByCluster = async (req, res) => {
  try {
    const { clusterCode } = req.body; // Extract clusterCode from request parameters
    const outlet = await BenchMarkOutletsModel.findOne({ clusterCode }); // Find outlets matching the clusterCode
    if (!outlet) {
      return res.status(404).json({ message: "No outlets found for this cluster" });
    }
    res.status(200).json({status:true, outlet}); // Return outlets found
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving outlets" });
  }
};

// Get All Outlets
exports.getAllOutlets = async (req, res) => {
  try {
    const outlets = await BenchMarkOutletsModel.find(); // Find all outlets
    res.status(200).json(outlets); // Return all outlets
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving outlets" });
  }
};
