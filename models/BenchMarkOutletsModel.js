const mongoose = require("mongoose");

const BenchmarkOutletSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    district: {
      type: String,
      default: ""
    },
    division: {
      type: String,
      default: ""
    },
    thana: {
      type: String,
      default: ""
    },
    populationDensity: {
      type: String,
      default: ""
    },
    incomeLevel: {
      type: String,
      default: ""
    },
    sqftRange: {
      type: String,
      default: ""
    },
    clusterCode: {
        type: String,
        default: "",
    },
    locationType: {
        type: String,
        default: "",
    },
    maxSales: {
      type: Number,
      default: null,
    },
    gpPercent: {
      type: Number,
      default: null
    },
    footFall: {
      type: Number,
      default: null
    },
    sqft: {
      type: Number,
      default: null
    },
    pnp: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BenchmarkOutlet", BenchmarkOutletSchema);