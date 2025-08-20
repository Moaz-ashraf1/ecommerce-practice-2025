const { check } = require("express-validator");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/categoryModel");
const subCategory = require("../../models/subCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage(`Invalid Product Id Format")];`),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage(`Product Title Required`)
    .isLength({
      min: 3,
    })
    .withMessage(`Too short Product Title`)
    .isLength({ max: 100 })
    .withMessage(`Too long Product Title`),

  check("description")
    .notEmpty()
    .withMessage(`product Description Required`)
    .isLength({
      min: 20,
    })
    .withMessage(`Too short Product Description`)
    .isLength({
      max: 2000,
    })
    .withMessage(`Too Long Product Description`),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage(`Product Sold should be a number`),

  check("quantity")
    .notEmpty()
    .withMessage(`Product Quantity Required`)
    .isNumeric()
    .withMessage(`Product Quantity should be a number`),

  check("price")
    .notEmpty()
    .withMessage(`Product Price Required`)
    .isNumeric()
    .withMessage(`Invalid Product Price`)
    .custom((value) => {
      if (value.toString().isLength > 20) {
        throw new Error("Product Price too large");
      }
      return true;
    }),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage(`Invalid Product Price After Discount`)
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          "Product Price After Discount should be less than Product Price"
        );
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("avalid Product Colors should be array of strings"),

  check("imageCover").notEmpty().withMessage(`Product Image Cover Required`),

  check("images").optional().isArray().withMessage("Product Images Required"),

  check("category")
    .notEmpty()
    .withMessage(`Product Category Required`)
    .isMongoId()
    .withMessage(`Invalid Category Id Format`)
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) throw new Error(`No Category For this Id: ${value} `);
      return true;
    }),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage(`Invalid Id Format`)
    .custom(async (supercategoriesIds) => {
      const results = await subCategory.find({
        _id: {
          $exists: true,
          $in: supercategoriesIds,
        },
      });

      if (
        results.length === 0 ||
        results.length !== supercategoriesIds.length
      ) {
        throw new Error("Invalid Subcategories Ids");
      }
    })
    .custom(async (value, { req }) => {
      const subCategories = await subCategory.find({
        category: req.body.category,
      });

      // Check if all subcategoriesIds are in the same category as the product category.
      const subCategoriesIdsInDB = [];
      subCategories.forEach((sub) => {
        subCategoriesIdsInDB.push(sub._id.toString());
      });

      if (
        !value.every((subcategoryId) =>
          subCategoriesIdsInDB.includes(subcategoryId)
        )
      ) {
        throw new Error("All Subcategories Ids should be in the same Category");
      }
    }),
  check("brand").optional().isMongoId().withMessage(`Invalid Brand Id Format`),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage(`Rating Average must ba a number`)
    .custom((value) => {
      if (value < 0 || value > 5) {
        throw new Error("Invalid Rating Average");
      }
      return true;
    }),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage(`Rating Quantity must be a number`),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage(`Invalid Product Id Format`),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage(`Invalid Product Id Format`),
  validatorMiddleware,
];
