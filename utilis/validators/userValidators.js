const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { check, body } = require("express-validator");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("you must enter subcategory id")
    .isMongoId()
    .withMessage(`Invaild SubCategory Id Format`),

  validatorMiddleware,
];
exports.createUserValidator = [
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

  check("profileImage").optional(),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG", "ar-SA")
    .withMessage(
      `Invalid Phone Number format only accept for Egypt and Saudi Arabia numbers`
    ),

  check("role").optional().isIn(["admin", "user"]),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage(`Invalid User ID Format`),

  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage(`Name must be at least 3 characters long`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .notEmpty()
    .withMessage(`Email is required")`)
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new Error("Email already exists");
      return true;
    }),

  check("profileImage").optional(),

  check("phone").optional().isMobilePhone("ar-EG", "ar-SA"),

  check("role").optional().isIn(["admin", "user"]),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage(`Invalid User ID Format`),
  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage(`Invalid User ID Format`),

  check("currentPassword")
    .notEmpty()
    .withMessage(`Current Password is required`),
  check("passwordConfirm").notEmpty().withMessage(`New Password is required`),
  check("password")
    .notEmpty()
    .withMessage(`Confirm Password is required`)
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User Not Found");
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isPasswordMatch) {
        throw new Error("Incorrect Current Password");
      }

      if (value !== req.body.passwordConfirm) {
        throw new Error("Password and password confirm do not match");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage(`Name must be at least 3 characters long`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .notEmpty()
    .withMessage(`Email is required")`)
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new Error("Email already exists");
      return true;
    }),

  check("phone").optional().isMobilePhone("ar-EG", "ar-SA"),

  validatorMiddleware,
];
