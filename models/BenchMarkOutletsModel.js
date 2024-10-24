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
    clusterCode: {
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
    avgMonthlyProfit: {
      type: Number,
      default: null
    },
    district: {
      type: String,
      default: ""
    },
    division: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("BenchmarkOutlet", BenchmarkOutletSchema);