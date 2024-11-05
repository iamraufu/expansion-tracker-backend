const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "investor"
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ""
    },
    dob: {
      type: String,
      default: ""
    },
    age: {
      type: Number,
      default: 0
    },
    gender: {
      type: String,
      required: true
    },
    profession: {
      type: String,
      required: true
    },
    profession_nature: {
      type: String,
      default: ""
    },
    education: {
      type: String,
      required: true
    },
    investmentBudget: {
      type: Number,
      required: true
    },
    possibleInvestmentDate: {
      type: Date, required: true
    },
    division: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    upazila: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },
    location: {
      longitude: {
        type: Number
      },
      latitude: {
        type: Number
      },
    },
    sites: {
      type: Array,
      Of: mongoose.Types.ObjectId, 
      ref: "Site",
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    isDeleted: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Investor", investorSchema);;