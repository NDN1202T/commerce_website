const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // nay kh dc trung ten Category
      trim: true,
    },
    description: {
      type: String,
      default: "", // co the them hoac hog
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);