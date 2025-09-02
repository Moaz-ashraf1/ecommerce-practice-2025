const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  validatorMiddleware,
];
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
  check("user").isMongoId().withMessage(`Invalid User Id Format`),
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

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage(`brand Required`)
    .isLength({
      min: 3,
    })
    .withMessage(`Too short brand name`)
    .isLength({
      max: 32,
    })
    .withMessage(`Too long brand name`)
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  check("name")
    .optional()
    .notEmpty()
    .withMessage(`Brand Required`)
    .isLength({
      min: 3,
    })
    .withMessage(`Too short Brand name`)
    .isLength({
      max: 32,
    })
    .withMessage(`Too long Brand name`),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage(`Invaild Brand Id Format`),
  validatorMiddleware,
];
