const mongoose = require("mongoose");

const FeasibiltySchema = new mongoose.Schema(
  {
    clusterCode: {
      type: Object,
      default: "",
    },
    scroreBoard: {
      type: Object,
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    },
    Site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
        default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

module.exports = mongoose.model("Feasibilty", FeasibiltySchema);