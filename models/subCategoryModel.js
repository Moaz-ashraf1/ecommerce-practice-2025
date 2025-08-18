const mongoose = require("mongoose");
const { type } = require("os");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be unique"],
      minlength: [2, "To Short Subcategory Name"],
      maxlength: [32, "To Long Subcategory Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, " SubCategory must be belong to parent category"],
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("subCategory", subCategorySchema);
