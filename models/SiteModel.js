const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for document objects
const documentSchema = new Schema({
  url: { type: String, required: true },
  status: { type: String, required: true },
  fileType: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// Define schema for picture objects
const picturesSchema = new Schema({
  url: { type: String, required: true },
  fileType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Define schema for site history
const siteHistorySchema = new Schema({
  status: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

// Define schema for investors
const investorSchema = new Schema({
  investorId: { type: mongoose.Types.ObjectId, ref: "Investor" },
  investmentBudget: { type: Number, required: true },
  possibleInvestmentDate: { type: Date, required: true },
});

// Define schema for status details
const statusDetailSchema = new Schema({
  status: { type: String, required: true },
  remarks: { type: String },
  approvedBy: { type: String },
  equipmentOptions: { type: [String] },
  createdAt: { type: Date, require: true },
  updatedAt: { type: Date, require: true },
  openingDate: { type: Date, default: null },
});


// Define schema for the site
const siteSchema = new Schema(
  {
    customId: { type: String, required: true },
    sapCode: { type: String, default: "" },
    landlords: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Landlord" }],
      default: [],
    },
    investors: {
      type: [investorSchema],
      default: [],
    },
    name: { type: String, required: true },
    sqft: { type: String, required: true },
    status: { type: String, required: true },
    siteHistory: { type: [siteHistorySchema], required: true },
    frontFace: { type: String, required: true },
    askingAdvance: { type: String, required: true },
    askingRent: { type: String, required: true },
    premisesStructure: { type: String, required: true },
    estimatedHandoverDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    address: { type: String, required: true },
    locationType: { type: String, default: "" },
    civilWorkType: { type: String, default: "" },
    feasibilityDoneByOperations: { type: Boolean, default: false },
    documents: {
      type: [documentSchema],
      default: [],
    },
    pictures: {
      type: [picturesSchema],
      default: [],
    },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    isDeleted: { type: Boolean, default: false },
    statusDetails: {
      type: [statusDetailSchema],
      default: [],
    },
    feasibility: {
      type: Object,
      default: {}
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Site", siteSchema);
