const mongoose = require("mongoose");

// create blacklist schema

const blackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required for blacklisting"],
    },
  },
  { timestamps: true },
);

const blackListModel = mongoose.model("blacklist", blackListSchema);

module.exports = blackListModel;
