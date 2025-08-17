const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");
const AppError = require("../utilis/AppError");

// @desc Get List Of Categories
// @route GET /api/v1/categories
// @acess Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(200).json({ page, results: categories.length, data: categories });
});

// @desc Create Category
// @route POST /api/v1/categories
// @acess Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc Get Specific Category By Id
// @route GET /api/v1/categories/id
// @acess Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new AppError(`No Category For This Id ${id}`, 404));
  }
  res.status(201).json({ category });
});

// @desc Update Specific Category
// @route GET /api/v1/categories/id
// @acess Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new AppError(`No Category For This Id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc Delete Specific Category
// @route DELETE /api/v1/categories/id
// @acess Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new AppError(`No Category For This Id ${id}`, 404));
  }
  res.status(204).json({ data: `${category.name} Category Is Deleted` });
});
