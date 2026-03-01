const mongoose = require("mongoose");

// create post schema

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    postImg: {
      type: String,
      required: [true, "Post image is required for an creating a post"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User Id is required for an creating an post"],
    },
  },
  { timestamps: true },
);

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
