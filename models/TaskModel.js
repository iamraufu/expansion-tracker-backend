const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for the site
const taskSchema = new Schema(
  {
    task: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
    taskStatus: { type: Boolean, default: false },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },

    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      default: null,
    },
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investor",
      default: null,
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      default: null,
    },
    openingDate: {
      type: Date,
      default: null,
    },
    startDateTime: {
      type: Date,
      default: null,
    },
    endDateTime: {
      type: Date,
      default: null,
    },
    equipment: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    sqft: { type: Number, default: 0 },
    details: { type: String, default: "" },
    remarks: { type: String, default: "" },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
