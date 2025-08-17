const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { check } = require("express-validator");

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
    .withMessage(`Too long category name`),
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
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage(`Invaild Category Id Format`),
  validatorMiddleware,
];
