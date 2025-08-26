const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Brand Required`],
      unique: [true, `Brand Must Be Unique`],
      minlength: [3, `To Short Brand Name`],
      maxlength: [32, `To Long Brand Name`],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timeStamps: true }
);
brandSchema.post("init", (doc) => {
  doc.image = `${process.env.BASE_URL}/brands/images/${doc.image}`;
});

brandSchema.post("save", (doc) => {
  doc.image = `${process.env.BASE_URL}/brands/images/${doc.image}`;
});

const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;
