const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utilis/ApiError");
const subCategoryModel = require("../models/subCategoryModel");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

exports.createSubCategory = factory.createOne(subCategoryModel);

exports.getSubCategory = factory.getOne(subCategoryModel);

exports.getSubCategories = factory.getAll(subCategoryModel);

exports.updateSubCategory = factory.updateOne(subCategoryModel);

exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
