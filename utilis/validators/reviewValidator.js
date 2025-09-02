const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage(`ratings value required`)
    .isFloat({
      min: 1,
      max: 5,
    })
    .withMessage(`ratings value must be between 1.0 and 5.0`),

  check("product")
    .isMongoId()
    .withMessage(`Invalid Product Id Format`)
    .custom(async (value, { req }) => {
      const review = await Review.findOne({
        user: req.user._id,
        product: value,
      });
      if (review) {
        throw new Error(`You already created a review before`);
      }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage(`Invaild Review Id Format`)
    .custom(async (value, { req }) => {
      const review = await Review.findById(value);
      if (!review) {
        throw new Error(`Review not found`);
      }
      console.log(req.user._id, review.user);
      if (req.user._id.toString() !== review.user.toString()) {
        throw new Error(`You are not allowed to update this review`);
      }
    }),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage(`Invaild Review Id Format`)
    .custom(async (value, { req }) => {
      const review = await Review.findById(value);
      if (!review) {
        throw new Error(`Review not found`);
      }
      if (
        req.user._id.toString() !== review.user.toString() &&
        req.user.role === "user"
      ) {
        throw new Error(`You are not allowed to delete this review`);
      }
    }),
  validatorMiddleware,
];
