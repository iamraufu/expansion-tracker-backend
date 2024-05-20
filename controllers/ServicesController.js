const InvestorModel = require('../models/InvestorModel');
const LandlordModel = require('../models/LandlordModel');




const investorAndLandlordData = async (req, res) => {
  console.log(req.body);

  const filter = req.body

  try {
    const investors = await InvestorModel.find({filter});
    const landlords = await LandlordModel.find({filter});

    const combinedData = [...investors, ...landlords];

    res.status(200).json({status: true, data:combinedData});
  } catch (error) {
    console.log(error);
    res.status(500).json({
        status: false,
        message: `${error}`,
      });
  }
}

module.exports = {
    investorAndLandlordData
};