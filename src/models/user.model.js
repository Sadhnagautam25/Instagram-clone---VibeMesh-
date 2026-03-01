const mongoose = require("mongoose");

// create user schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "User name is alreay exists"],
    required: [true, "User name is required ⚠️"],
  },

  email: {
    type: String,
    unique: [true, "Email is already exists"],
    required: [true, "Email is required ⚠️"],
  },

  password: {
    type: String,
    unique: [true, "Password is required"],
    select:false,
  },
  bio: String,
  profileImg: {
    type: String,
    default:
      "https://ik.imagekit.io/habrddp30/default%20image.avif?updatedAt=1770870508311",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
