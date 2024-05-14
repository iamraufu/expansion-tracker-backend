const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const InvestorModel = require("../models/InvestorModel");
const mongoose = require("mongoose");

const search = async (req, res) => {
  const filter = req.body;

  const items = await InvestorModel.find(filter)

    .select(" -password")
    .lean()
    .populate({
      path: "createdBy",
      select: " -password",
    })
    .populate({
      path: "sites",
    });

  const responseObject = {
    status: true,
    // totalPages: Math.ceil(totalItems / pageSize),
    // totalItems,
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

// Register a new investor
const registerInvestor = async (req, res) => {
  try {
    const { phone } = req.body;
    const investor = Boolean(await InvestorModel.findOne({ phone }));

    if (!investor) {
      let newInvestor = await InvestorModel.create(req.body);

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
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

// GET investor by Id
const getOneInvestor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Investor Id Incorrect`,
      });
    }

    let foundInvestor = await InvestorModel.findById(id)
      .lean()
      .populate({
        path: "createdBy",
        select: " -password",
      })
      .populate({
        path: "sites",
      });

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
};
