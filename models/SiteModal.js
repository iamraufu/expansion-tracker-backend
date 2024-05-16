const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siteHistorySchema = new Schema({
  status: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const investorSchema = new Schema({
  investorId: { type: mongoose.Types.ObjectId, ref: "Investor" },
  investmentBudget: { type: String, required: true },
  possibleInvestmentDate: { type: Date, required: true },
});

const siteSchema = new Schema(
  {
    customId: { type: String, required: true },
    sapCode: { type: String , default: ""},

    landlords: {
      type: Array,
      Of: mongoose.Types.ObjectId,
      ref: "Landlord",
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
    documents: {
      type: [String],
      default: [],
    }, // Array of URLs
    pictures: {
      type: [String],
      default: [],
    }, // Array of URLs
    location: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Site", siteSchema);
