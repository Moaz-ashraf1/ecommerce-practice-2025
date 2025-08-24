const { check, body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild Category Id Format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage(`Category Required`)
    .isLength({
      min: 3,
    })
    .withMessage(`Too short category name`)
    .isLength({
      max: 32,
    })
    .withMessage(`Too long category name`)
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  ,
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage(`Invalid Category Id Format`),
  check("name")
    .notEmpty()
    .withMessage(`Category Required`)
    .isLength({
      min: 3,
    })
    .withMessage(`Too short category name`)
    .isLength({
      max: 32,
    })
    .withMessage(`Too long category name`),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage(`Invaild Category Id Format`),
  validatorMiddleware,
];
