const express = require("express");

const Router = express.Router();
const { createSubCategory } = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
} = require("../utilis/validators/subCategoryValidators");

Router.route("/").post(createSubCategoryValidator, createSubCategory);

module.exports = Router;
