const express = require("express");

const {
  getAllCategories,
  createCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

module.exports = router;
