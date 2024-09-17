const InvestorModel = require("../models/InvestorModel");
const mongoose = require("mongoose");

const generateCustomId = async () => {
  try {
    // Find the count of existing investors
    const count = await InvestorModel.countDocuments();

    // Generate the custom ID based on the count
    const customId = `INV${String(count + 1).padStart(4, "0")}`;

    return customId;
  } catch (error) {
    console.error("Error generating custom ID:", error);
    throw error;
  }
};

// Register a new investor
const registerInvestor = async (req, res) => {
  try {
    const { phone } = req.body;
    const investor = Boolean(await InvestorModel.findOne({ phone }));

    if (!investor) {
      // Generate custom ID
      const customId = await generateCustomId();

      console.log(customId);

      // Create new investor with custom ID
      const newInvestor = await InvestorModel.create({ ...req.body, customId });

      return res.status(201).send({
        status: true,
        message: "Investor created successfully!",
        investor: newInvestor,
      });
    } else {
      return res.status(409).send({
        status: false,
        message: `User exist with ${phone}`,
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

// GET all investors
const getAllInvestors = async (req, res) => {
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

  const items = await InvestorModel.find({...filter, isDeleted: false}).lean().populate({
    path: "createdBy",
    select: " -password",
  });
  // .populate({
  //   path: "sites",
  // });

  const responseObject = {
    status: true,
    investors: items,
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

// GET investor by Id
const getOneInvestor = async (req, res) => {
  const { id } = req.params;

  // console.log(id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Investor Id Incorrect`,
      });
    }

    let foundInvestor = await InvestorModel.findById(id).lean().populate({
      path: "createdBy",
      select: " -password",
    });
    // .populate({
    //   path: "sites",
    // });

    foundInvestor = {
      ...foundInvestor,
    };

    if (!foundInvestor) {
      return res.status(404).json({
        status: false,
        message: `Investor not found`,
      });
    }

    res.status(200).json({
      status: true,
      investor: foundInvestor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};
// Update investor by Id
const updateInvestor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Investor Id incorrect`,
      });
    }

    const investor = await InvestorModel.findById(id);
    const investorExist = Boolean(investor);

    if (!investorExist) {
      return res.status(401).json({
        status: false,
        message: `User doesn't exist`,
      });
    }

    let updatedInvestor = await InvestorModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: true,
      message: "Investor updated successfully",
      user: updatedInvestor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

module.exports = {
  registerInvestor,
  getAllInvestors,
  getOneInvestor,
  updateInvestor,
};
