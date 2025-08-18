const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage(`SubCategory Required`)
    .isLength({
      min: 2,
    })
    .withMessage(`Too short SubCategory name`)
    .isLength({
      max: 32,
    })
    .withMessage(`Too Long SubCategory name`),
  check("category")
    .notEmpty()
    .withMessage(`SubCategory must be belong to Category`)
    .isMongoId()
    .withMessage("Invaild Category Id Format"),

  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("you must enter subcategory id")
    .isMongoId()
    .withMessage(`Invaild SubCategory Id Format`),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("you must enter subcategory id")
    .isMongoId()
    .withMessage(`Invaild SubCategory Id Format`),

  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("you must enter subcategory id")
    .isMongoId()
    .withMessage(`Invaild SubCategory Id Format`),

  validatorMiddleware,
];
