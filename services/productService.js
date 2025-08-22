const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");
const ApiError = require("../utilis/ApiError");
const parseQuery = require("../utilis/queryParser");

exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1) filtering
  const queryStringObject = { ...req.query };
  const execludeFields = ["page", "limit", "fields", "sort"];
  execludeFields.forEach((value) => {
    delete queryStringObject[value];
  });

  const mongooseQueryObject = parseQuery(queryStringObject);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  let mongooseQueruy = Product.find(mongooseQueryObject)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name -_id",
    });

  // if (req.query.sort) {
  //   console.log(req.query.sort);
  //   mongooseQueruy = mongooseQueruy.sort(req.query.sort);
  // }
  const products = await mongooseQueruy;
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
