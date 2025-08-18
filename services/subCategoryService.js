const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utilis/ApiError");
const subCategoryModel = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

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

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No SubCategory For This Id ${id}`));
  }
  res.status(200).json({
    data: subCategory,
  });
});

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;

  // let filterObject = {};
  // console.log(req.params.categoryId);
  // if (req.params.categoryId) {
  //   filterObject = { category: req.params.categoryId };
  // }

  const subcategories = await subCategoryModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  res.status(200).json({
    results: subcategories.length,
    page,
    data: subcategories,
  });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No SubCategory For This Id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    return next(new ApiError(`No SubCategory For This Id ${id}`, 404));
  }
  await subCategoryModel.deleteOne({ _id: id });

  res.status(200).json({
    status: "success",
    message: `SubCategory with id ${id} has been deleted successfully`,
  });
});
