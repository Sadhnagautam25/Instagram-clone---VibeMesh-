const mongoose = require('mongoose')

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Aapka User Model ka naam
      required: [true, "Follower ID is required"],
    },
    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Followee ID is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Ye ensure karta hai ki ek user dusre user ko sirf EK hi baar follow kar sake
followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followModel = mongoose.model("Follows", followSchema);

module.exports = followModel;