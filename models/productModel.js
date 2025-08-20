const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, "Product Title Must Be Unique"],
    required: [true, "Product Title Required"],
    trim: true,
    minlength: [3, "Too Short Product Title"],
    maxlength: [100, "Too Long Product Title"],
  },

  slug: {
    type: String,
    required: true,
    lowercase: true,
  },

  description: {
    type: String,
    required: [true, `Product Description Required`],
    minlength: [20, "Too Short Product Description"],
  },

  quantity: {
    type: Number,
    required: [true, "Product Quantity Required"],
  },

  sold: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, "Product Price Required"],
  },

  priceAfterDiscount: {
    type: Number,
  },
  colors: [String],
  imageCover: {
    type: String,
    required: [true, "Product Image Cover Required"],
  },
  images: [String],

  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Product Must Belong to Category"],
  },

  subcategories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
    },
  ],

  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },

  ratingAverage: {
    type: Number,
    min: [1, "Rating must be between 1 and 5"],
    max: [5, "Rating must be between 1 and 5"],
  },

  ratingQuantity: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);
