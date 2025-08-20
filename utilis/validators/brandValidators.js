const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
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
    .withMessage(`Too long brand name`),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage(`Invalid Brand Id Format`),
  check("name")
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
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage(`Invaild Brand Id Format`),
  validatorMiddleware,
];
