const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utilis/ApiError");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize({ width: 600, height: 600 })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/images/${filename}`);

    req.body.image = filename;
  }
  next();
});

exports.getAllCategories = factory.getAll(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);
