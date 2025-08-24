const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utilis/ApiError");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

exports.getAllCategories = factory.getAll(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);
