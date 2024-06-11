const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const activityLogModel = mongoose.model("ActivityLog", ActivitySchema);

module.exports = activityLogModel;
