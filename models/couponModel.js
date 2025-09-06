const mongoose = require("mongoose");
const { timeStamp } = require("node:console");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name is required"],
      unique: true,
      trim: true,
    },
    expire: {
      type: Date,
      required: [true, "coupon expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount is required"],
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
