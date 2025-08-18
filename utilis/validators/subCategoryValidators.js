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
  check("category").isMongoId().withMessage("Invaild Category Id Format"),

  validatorMiddleware,
];
