const mongoose = require("mongoose");

// 1- Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Required"],
      unique: [true, "Category Must Be Unique "],
      minlength: [3, "Too Short Category Name"],
      maxlength: [32, "Too Long Category Name"],
    },

    // A annd B ==> shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },

    image: String,
  },
  { timestamps: true } //created At, updated At
);

CategorySchema.post("init", (doc) => {
  doc.image = `${process.env.BASE_URL}/categories/images/${doc.image}`;
});

CategorySchema.post("save", (doc) => {
  doc.image = `${process.env.BASE_URL}/categories/images/${doc.image}`;
});

// 2- Create Model
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel; // I Use this model to make CURD Operations
