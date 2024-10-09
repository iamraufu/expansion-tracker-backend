const InvestorModel = require("../models/InvestorModel");
const LandlordModel = require("../models/LandlordModel");
const SiteModal = require("../models/SiteModel");
const TaskModal = require("../models/TaskModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

const levels = [
  {
    level: 1,
    status: "site found",
  },
  {
    level: 2,
    status: "site negotiation",
  },
  {
    level: 3,
    status: "investor and site confirmation",
  },
  {
    level: 4,
    status: "feasibility study",
  },
  {
    level: 5,
    status: "RMIA validation",
  },

  {
    level: 6,
    status: "GMD approval",
  },
  {
    level: 7,
    status: "premises agreement",
  },
  {
    level: 8,
    status: "docs collected",
  },

  {
    level: 9,
    status: "layout approved",
  },
  {
    level: 10,
    status: "franchise agreement",
  },

  {
    level: 11,
    status: "civil work",
  },
  {
    level: 12,
    status: "equipment order",
  },
  {
    level: 13,
    status: "equipment installation",
  },
  {
    level: 14,
    status: "hr ready",
  },
  {
    level: 15,
    status: "product receiving",
  },
  {
    level: 16,
    status: "merchandising",
  },
  {
    level: 17,
    status: "branding",
  },
  {
    level: 18,
    status: "inauguration",
  },
  {
    level: 19,
    status: "site complete",
  },
];

const investorAndLandlordData = async (req, res) => {
  const filter = req.body;

  try {
    const investors = await InvestorModel.find({...filter, isDeleted: false}).populate({
      path: "createdBy",
      populate: [{ path: "managers" }],
      // select: "name",
    });
    const landlords = await LandlordModel.find({...filter, isDeleted: false}).populate({
      path: "createdBy",
      populate: [{ path: "managers" }],
      // select: "name",
    });
    const sites = await SiteModal.find({...filter, isDeleted: false});

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
      return res.status(400).json({
        message: 'Invalid owner type. Must be either "landlord" or "investor".',
      });
    }

    const query = { isComplete: true, taskStatus: true };
    query[ownerType] = ownerId;

    // Find if any task with isComplete true contains the given landlord or investor ID
    const taskExists = await TaskModal.exists(query);

    // Return true if task exists, otherwise false
    if (taskExists) {
      return res.status(200).json({
        result: true,
        status: true,
        message: "successfully retrived data",
      });
    } else {
      return res.status(200).json({
        result: false,
        status: true,
        message: "successfully retrived data",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      status: false,
      message: `Server Error: ${error}`,
    });
  }
};

const managerAssign = async (req, res) => {
  const { userId, managerId } = req.body;

  try {
    // Find the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from previous managers' employees arrays
    for (let prevManagerId of user.managers) {
      const prevManager = await UserModel.findById(prevManagerId);
      if (prevManager) {
        prevManager.employees.pull(userId);
        await prevManager.save();
      }
    }

    // Clear the user's managers array
    user.managers = [];

    // Add the new manager to the user's managers array if it's not already present
    if (!user.managers.includes(managerId)) {
      user.managers.push(managerId);
      await user.save();
    }

    // Add the user to the new manager's employees array if it's not already present
    const manager = await UserModel.findById(managerId);
    if (manager && !manager.employees.includes(userId)) {
      manager.employees.push(userId);
      await manager.save();
    }

    res.status(200).json({ message: "Manager assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getStatusCounts = async (req, res) => {

  // console.log(req.body);

  let filter = {
    isDeleted: false,
    // status: { $ne: "site complete" }
  }
  let filterFunnel = {
    isDeleted: false,
    status: { $ne: "site complete" }
  }


  let filter2 = {
    isDeleted: false,
    status: { $nin: ["site found", "site negotiation"] }
  }

  let investorFilter = {
    isDeleted: false,
  }

  if(req?.body?.createdBy?.length > 0){
    const createdByArray = req?.body?.createdBy?.map(id => new mongoose.Types.ObjectId(id));
    // console.log(createdByArray);
    filter.createdBy = { $in: createdByArray };
    filter2.createdBy = { $in: createdByArray };
    filterFunnel.createdBy = {$in: createdByArray}
    investorFilter.createdBy = { $in: createdByArray };
  }



  // console.log("filter : ");
  // console.log({filter});

  try {
    const result = await SiteModal.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          sites: { $push: "$$ROOT" }
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          sites: 1
        },
      },
    ]);
    const result2 = await SiteModal.aggregate([
      {
        $match: filterFunnel,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          sites: { $push: "$$ROOT" }
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          sites: 1
        },
      },
    ]);

    const allSite = await SiteModal.find(filter)
    const aggreedInvestors = await SiteModal.countDocuments(filter2)
    const allIvestors = await InvestorModel.countDocuments(investorFilter)

    // console.log(result);
    // // Create a map of status to counts
    // const statusCounts = result.reduce((acc, curr) => {
    //   acc[curr.status] = curr.count;
    //   return acc;
    // }, {});

       // Create a map of status to counts and sites
       const statusData = result.reduce((acc, curr) => {
        // console.log(curr);
        acc[curr.status] = {
          count: curr.count,
          sites: curr.sites  // Store the array of site objects
        };
        return acc;
      }, {})
       const statusData2 = result2.reduce((acc, curr) => {
        // console.log(curr);
        acc[curr.status] = {
          count: curr.count,
          sites: curr.sites  // Store the array of site objects
        };
        return acc;
      }, {})

    // Calculate the final counts based on levels
    // const levelCounts = levels.map((levelObj, index) => {
    //   let totalCount = 0;
    //   for (let i = index; i < levels.length; i++) {
    //     totalCount += statusCounts[levels[i].status] || 0;
    //   }
    //   return {
    //     status: levelObj.status,
    //     level: levelObj.level,
    //     count: totalCount,
    //   };
    // });

        // Calculate the final counts based on levels, including site data
        const levelCounts = levels.map((levelObj, index) => {
          let totalCount = 0;
          let combinedSites = [];
    
          for (let i = index; i < levels.length; i++) {
            totalCount += statusData[levels[i].status]?.count || 0;
            combinedSites = combinedSites.concat(statusData[levels[i].status]?.sites || []);
          }
    
          return {
            status: levelObj.status,
            level: levelObj.level,
            count: totalCount,
            sites: combinedSites,  // Include the sites array in the response
          };
        });
        const levelCounts2 = levels.map((levelObj, index) => {
          let totalCount = 0;
          let combinedSites = [];
    
          for (let i = index; i < levels.length; i++) {
            totalCount += statusData2[levels[i].status]?.count || 0;
            combinedSites = combinedSites.concat(statusData2[levels[i].status]?.sites || []);
          }
    
          return {
            status: levelObj.status,
            level: levelObj.level,
            count: totalCount,
            sites: combinedSites,  // Include the sites array in the response
          };
        });
    

    // console.log({levelCounts});

    res.status(200).json({ data: result, allSites:allSite , funnelData:levelCounts,onlyFunnelData:levelCounts2, aggreedInvestors: aggreedInvestors, allIvestors:allIvestors, message: "data found", status: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message, message: "data npt found", status: false });
  }
};


const createSiteWithFeasibilty = async (req,res) => {
  console.log(req.body);
}

module.exports = {
  investorAndLandlordData,
  getOneSiteWithPartners,
  checkOwnerTasks,
  managerAssign,
  getStatusCounts,
  createSiteWithFeasibilty
};
