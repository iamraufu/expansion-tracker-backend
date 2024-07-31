const Activity = require("../models/ActivityModel");
const User = require('../models/UserModel');
// create a activity
const createActivityLog = async (req, res) => {
  const data = req.body;

  console.log(data);
  try {
    const NewActivity = await Activity.create(data);
    res.status(201).json({ message: "User activity recorded" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

// get all acitivity
const getAllActivityLog = async (req, res) => {
  try {
    const allActivity = await Activity.find().populate({
      path: 'user',
      select: '-__v -password -createdAt -updatedAt' });
    res.status(201).json({
      status: true,
      logs: allActivity,
    });
    
  } catch (err) {
    res.status(500).json({ status:false, message: err.message });
  }
};



// get all acitivity by type
const getAllActivityLogByType = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const allActivity = await Activity.find(data)
    .populate({
      path: "user",
      select: "-__v -password -createdAt -updatedAt",
    });

    res.status(201).json({
      status: true,
      logs: allActivity.reverse(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err.message });
  }
};



module.exports = {
  createActivityLog,
  getAllActivityLog,
  getAllActivityLogByType,
};
