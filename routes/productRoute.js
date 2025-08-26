const express = require("express");

const router = express.Router();

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utilis/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uplodProductImage,
  resizeProductImage,
} = require("../services/productService");

router.route("/").get(getProducts).post(
  uplodProductImage,

  resizeProductImage,
  createProductValidator,
  createProduct
);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uplodProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
