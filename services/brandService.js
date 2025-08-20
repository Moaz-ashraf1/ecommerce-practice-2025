const asynHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utilis/ApiError");
const brandModel = require("../models/brandModel");

exports.createBrand = asynHandler(async (req, res, next) => {
  const { name } = req.body;
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json({ data: brand });
});

exports.getBrands = asynHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await brandModel.find().skip(skip).limit(limit);

  res.status(200).json({ page, results: brands.length, data: brands });
});

exports.getBrand = asynHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);

  if (!brand) {
    next(new ApiError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({ brand });
});

exports.updateBrand = asynHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!brand) {
    next(new ApiError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({ brand });
});

exports.deleteBrand = asynHandler(async (req, res, next) => {
  const id = req.params;
  const brand = brandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No Brand For This Id ${id}`, 404));
  }
  res.status(200).json({});
});
