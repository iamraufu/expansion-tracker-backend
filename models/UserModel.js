const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true,
            required: true
      },
      email: {
            type: String,
            unique: true,
            required: true,
            immutable: true
      },
      password: {
            type: String,
            required: true
      },
      role: {
            type: String,  // admin or user etc.
            default: "user",
      },
      managers: {
            type: Array,
            Of: mongoose.Types.ObjectId,   // array of strings that represent the manager a user have
            ref: "User",
            default: []
      },
      employees: {
            type: Array,
            Of: mongoose.Types.ObjectId,   // array of strings that represent the employees under a user
            ref: "User",
            default: []
      },
      isDeleted: {
            type: Boolean,
            default: false,
      },
      createdAt: {
            type: Date,
            default: new Date(),
            immutable: true
      },
      updatedAt: {
            type: Date,
            default: null
      }
})

module.exports = mongoose.model("User", userSchema)