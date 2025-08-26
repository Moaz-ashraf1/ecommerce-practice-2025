const express = require("express");
const subCategoriesRoute = require("./subCategoryRoute");
const multer = require("multer");
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
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
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subCategories", subCategoriesRoute);

module.exports = router;
