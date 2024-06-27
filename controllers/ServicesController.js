const InvestorModel = require("../models/InvestorModel");
const LandlordModel = require("../models/LandlordModel");
const SiteModal = require("../models/SiteModel");
const TaskModal = require("../models/TaskModel");
const mongoose = require("mongoose");

const investorAndLandlordData = async (req, res) => {
  // console.log(req.body);

  const filter = req.body;

  try {
    const investors = await InvestorModel.find(filter).populate({
      path: "createdBy",
      populate: [{ path: "managers" }],
      // select: "name",
    });
    const landlords = await LandlordModel.find(filter).populate({
      path: "createdBy",
      populate: [{ path: "managers" }],
      // select: "name",
    });
    const sites = await SiteModal.find(filter);

    const combinedData = [...investors, ...landlords];

    res.status(200).json({ status: true, data: combinedData, sites });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: `${error}`,
    });
  }
};

const getOneSiteWithPartners = async (req, res) => {
  const { id } = req.params;
  const filter = req.body;
  // console.log(id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        message: `Site Object Id Incorrect`,
      });
    }

    let foundSite = await SiteModal.findById(id)
      .lean()
      .populate({
        path: "landlords",
      })
      .populate({
        path: "investors.investorId",
      })
      .populate({
        path: "createdBy",
        populate: [{ path: "managers" }],
        select: "-password",
      })
      .exec();
    // .populate({
    //   path: "sites",
    // });

    const investors = await InvestorModel.find(filter);
    const landlords = await LandlordModel.find(filter);

    if (!foundSite) {
      return res.status(404).json({
        status: false,
        message: `Site not found`,
      });
    }

    foundSite = {
      ...foundSite,
    };

    res.status(200).json({
      status: true,
      site: foundSite,
      investors: investors,
      landlords: landlords,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: `${err}`,
    });
  }
};

// Controller function to check if any task with isComplete true contains the given investor ID
const checkOwnerTasks = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const ownerType = req.params.type; // 'landlord' or 'investor'

    if (ownerType !== "landlord" && ownerType !== "investor") {
      return res
        .status(400)
        .json({
          message:
            'Invalid owner type. Must be either "landlord" or "investor".',
        });
    }

    const query = { isComplete: true, taskStatus: true };
    query[ownerType] = ownerId;

    // Find if any task with isComplete true contains the given landlord or investor ID
    const taskExists = await TaskModal.exists(query);

    // Return true if task exists, otherwise false
    if (taskExists) {
      return res
        .status(200)
        .json({
          result: true,
          status: true,
          message: "successfully retrived data",
        });
    } else {
      return res
        .status(200)
        .json({
          result: false,
          status: true,
          message: "successfully retrived data",
        });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Server error",
        status: false,
        message: `Server Error: ${error}`,
      });
  }
};

module.exports = {
  investorAndLandlordData,
  getOneSiteWithPartners,
  checkOwnerTasks,
};
