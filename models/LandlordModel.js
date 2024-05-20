const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "landlord"
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
    // thana: {
    //   type: String,
    //   required: true
    // },
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
    // sites: {
    //   type: Array,
    //   Of: mongoose.Types.ObjectId, // array of strings that represent the manager a user have
    //   ref: "Site",
    //   default: [],
    // },
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

module.exports = mongoose.model("Landlord", landlordSchema);;