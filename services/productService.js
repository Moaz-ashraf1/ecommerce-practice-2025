const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const ApiError = require("../utilis/ApiError");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({}).skip(skip).limit(limit).populate({
    path: "category",
    select: "name -_id",
  });

  res.status(200).json({ page, results: products.length, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No Product For This Id ${id}`, 404));
  }
  res.status(200).json({ product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);

  res.status(201).json({ product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true }
  );
  if (!product) {
    return next(new ApiError(`No Product For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({ product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No Product For This Id ${id}`, 404));
  }

  res.status(200).json({ data: `${product.title} Product Is Deleted` });
});
