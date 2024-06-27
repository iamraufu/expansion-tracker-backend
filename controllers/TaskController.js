const TaskModal = require("../models/TaskModel");
const mongoose = require("mongoose");
const moment = require('moment-timezone');


const generateCustomId = async () => {
  try {
    // Find the count of existing task
    const count = await TaskModal.countDocuments();

    // Generate the custom ID based on the count
    const customId = `TASK${String(count + 1).padStart(4, "0")}`;

    return customId;
  } catch (error) {
    console.error("Error generating custom ID:", error);
    throw error;
  }
};

const search = async (req, res) => {
  const filter = req.body;

  const items = await TaskModal.find(filter)
    .lean()
    .populate({
      path: "landlord",
    })
    .populate({
      path: "investor",
    })
    .populate({
      path: "site",
    })
    .populate({
      path: "createdBy",
      populate: [{ path: "managers" }],
    })
    .exec();

  const responseObject = {
    status: true,
    tasks: items.reverse(),
  };

  if (items.length) {
    return res.status(200).json(responseObject);
  } else {
    return res.status(404).json({
      status: false,
      message: "Nothing found",
      users: items,
    });
  }
};

// Register a new task
// const addTask = async (req, res) => {
//   try {
//     // Generate custom ID
//     const customId = await generateCustomId();

//     // Create new task with custom ID
//     const newTask = await TaskModal.create({ ...req.body, customId });


//     console.log(newTask);

//     // return res.status(201).send({
//     //   status: true,
//     //   message: "Task created successfully!",
//     //   task: newTask,
//     // });
//   } catch (err) {
//     console.log(err);
//     res.send({
//       status: false,
//       message: `Error in registration : ${err}`,
//     });
//   }
// };



//Register a new task
const addTask = async (req, res) => {
  try {
    // Generate custom ID
    const customId = await generateCustomId();

    // Convert the startDateTime and endDateTime to Bangladeshi time
    const startDateTime = moment.tz(req.body.startDateTime, "Asia/Dhaka").toDate();
    const endDateTime = moment.tz(req.body.endDateTime, "Asia/Dhaka").toDate();

    // Create new task with custom ID and converted dates
    const newTask = await TaskModal.create({ 
      ...req.body, 
      customId,
      startDateTime,
      endDateTime
    });

    console.log(newTask);

    return res.status(201).send({
      status: true,
      message: "Task created successfully!",
      task: newTask,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: false,
      message: `Error in registration : ${err}`,
    });
  }
};

// GET all tasks
const getAllTasks = async (req, res) => {
    console.log(req.body);
  try {
    await search(req, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

// GET task by Id
const getOneTask = async (req, res) => {
  const { id } = req.params;

  // console.log(id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Task Object Id Incorrect`,
      });
    }

    let foundTask = await TaskModal.findById(id)
      .lean()
      .lean()
      .populate({
        path: "landlord",
      })
      .populate({
        path: "investor",
      })
      .populate({
        path: "site",
      })
      .populate({
        path: "assignedTo",
      })
      .populate({
        path: "createdBy",
      })
      .exec();

    if (!foundTask) {
      return res.status(404).json({
        status: false,
        message: `Task not found`,
      });
    }

    foundTask = {
      ...foundTask,
    };

    res.status(200).json({
      status: true,
      task: foundTask,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};
// Update task by Id
const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Task Object Id incorrect`,
      });
    }

    const task = await TaskModal.findById(id);
    const taskExists = Boolean(task);

    if (!taskExists) {
      return res.status(401).json({
        status: false,
        message: `Task doesn't exist`,
      });
    }

    // console.log(req.body);

    let updatedTask = await TaskModal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

module.exports = {
  addTask,
  getAllTasks,
  getOneTask,
  updateTask,
};
