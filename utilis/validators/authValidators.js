const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { check, body } = require("express-validator");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage(`Name must be at least 3 characters long`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage(`Email is required"`)
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new Error("Email already exists");
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage(`Password is required`)
    .isLength({ min: 6 })
    .withMessage(`Password must be at least 6 characters long`)
    .custom((password, { req }) => {
      if (req.body.passwordConfirm != password)
        throw new Error("Passwords do not match");
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage(`password Confirm is required`),

  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage(`Email is required"`)
    .isEmail()
    .withMessage("Invalid email format"),

  check("password")
    .notEmpty()
    .withMessage(`Password is required`)
    .isLength({ min: 6 })
    .withMessage(`Password must be at least 6 characters long`),

  validatorMiddleware,
];
