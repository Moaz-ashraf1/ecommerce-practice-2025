const asyncHandler = require("express-async-handler");
const ReviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};

exports.setProductIdToBody = (req, res, next) => {
  if (req.params.productId) req.body.product = req.params.productId;
  next();
};

exports.createReview = asyncHandler(async (req, res, next) => {
  console.log(req.params.productId);

  if (req.params.productId) req.body.product = req.params.productId;

  const newOne = await ReviewModel.create({
    user: req.user._id,
    title: req.body.title,
    ratings: req.body.ratings,
    product: req.body.product,
  });
  res.status(201).json({ data: newOne });
});

exports.getReviews = factory.getAll(ReviewModel);

exports.getReview = factory.getOne(ReviewModel);

exports.updateReview = factory.updateOne(ReviewModel);

exports.deleteReview = factory.deleteOne(ReviewModel);
