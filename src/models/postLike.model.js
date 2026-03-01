const mongoose = require("mongoose");

// create post like schema format

const postLikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "post Id is required for like a post"],
    },
    user: {
      type: String,
      required: [true, "User is required for like a post"],
    },
  },
  { timestamps: true },
);

postLikeSchema.index({ post: 1, user: 1 }, { unique: 1 });

const postLikeModel = mongoose.model("LikePosts", postLikeSchema);

module.exports = postLikeModel;


