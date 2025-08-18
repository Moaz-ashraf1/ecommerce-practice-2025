const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utilis/ApiError");
const subCategoryModel = require("../models/subCategoryModel");

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  await subCategory.populate("category");

  res.status(201).json({
    data: subCategory,
  });
});
