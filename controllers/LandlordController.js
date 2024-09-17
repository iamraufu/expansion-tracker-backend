const mongoose = require("mongoose");
const LandlordModel = require("../models/LandlordModel");

const generateCustomId = async () => {
  try {
    // Find the count of existing investors
    const count = await LandlordModel.countDocuments();

    // Generate the custom ID based on the count
    const customId = `LND${String(count + 1).padStart(4, "0")}`;

    return customId;
  } catch (error) {
    console.error("Error generating custom ID:", error);
    throw error;
  }
};

// Register a new landlord
const registerLandlord = async (req, res) => {
  console.log(req.body);

  try {
    const { phone } = req.body;
    const landlord = Boolean(await LandlordModel.findOne({ phone }));

    if (!landlord) {
      // Generate custom ID
      const customId = await generateCustomId();

      // Create new investor with custom ID
      const newLandlord = await LandlordModel.create({ ...req.body, customId });

      return res.status(201).send({
        status: true,
        message: "landlord created successfully!",
        landlord: newLandlord,
      });
    } else {
      return res.status(409).send({
        status: false,
        message: `Landlord exist with ${phone}`,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      status: false,
      message: `Error in registration : ${err}`,
    });
  }
};

// GET all landlords
const getAllLandlords = async (req, res) => {
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

const search = async (req, res) => {
  const filter = req.body;

  const items = await LandlordModel.find({...filter, isDeleted: false}).lean().populate({
    path: "createdBy",
    select: " -password",
  });
  // .populate({
  //   path: "sites",
  // });

  const responseObject = {
    status: true,
    landlords: items,
  };

  if (items.length) {
    return res.status(200).json(responseObject);
  } else {
    return res.status(401).json({
      status: false,
      message: "Nothing found",
      users: items,
    });
  }
};

// GET landlord by Id
const getOneLandlord = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Landlord Id Incorrect`,
      });
    }

    let foundLandlord = await LandlordModel.findById(id).lean().populate({
      path: "createdBy",
      select: " -password",
    });
    // .populate({
    //   path: "sites",
    // });

    foundLandlord = {
      ...foundLandlord,
    };

    if (!foundLandlord) {
      return res.status(404).json({
        status: false,
        message: `Landlord not found`,
      });
    }

    res.status(200).json({
      status: true,
      landlord: foundLandlord,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};
// Update landlord by Id
const updateLandlord = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Landlord Id incorrect`,
      });
    }

    const landlord = await LandlordModel.findById(id);
    const LandlordExists = Boolean(landlord);

    if (!LandlordExists) {
      return res.status(401).json({
        status: false,
        message: `User doesn't exist`,
      });
    }

    let updatedLandlord = await LandlordModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    
    res.status(201).json({
      status: true,
      message: "Landlord updated successfully",
      user: updatedLandlord,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

module.exports = {
  registerLandlord,
  getAllLandlords,
  getOneLandlord,
  updateLandlord,
};
