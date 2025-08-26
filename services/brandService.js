const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const ApiError = require("../utilis/ApiError");
const brandModel = require("../models/brandModel");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize({ width: 600, height: 600 })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/images/${filename}`);

    req.body.image = filename;
  }
  next();
});

exports.createBrand = factory.createOne(brandModel);

exports.getBrands = factory.getAll(brandModel);

exports.getBrand = factory.getOne(brandModel);

exports.updateBrand = factory.updateOne(brandModel);

exports.deleteBrand = factory.deleteOne(brandModel);
