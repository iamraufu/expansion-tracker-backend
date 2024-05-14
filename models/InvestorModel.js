const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    customID: { type: String, required: true },
    // type: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    profession: { type: String, required: true },
    education: { type: String, required: true },
    investmentBudget: { type: Number, required: true },
    possibleInvestmentDate: { type: Date, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    thana: { type: String, required: true },
    address: { type: String , required: true},
    location: {
      lon: { type: Number },
      lat: { type: Number },
    },
    sites: {
      type: Array,
      Of: mongoose.Types.ObjectId, // array of strings that represent the manager a user have
      ref: "Site",
      default: [],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Investor", investorSchema);;
