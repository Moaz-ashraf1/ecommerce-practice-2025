const express = require("express");
const subCategoriesRoute = require("./subCategoryRoute");

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utilis/validators/categoryValidators");

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subCategories", subCategoriesRoute);

module.exports = router;
