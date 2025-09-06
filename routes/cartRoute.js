const express = require("express");

const router = express.Router();

const {
  createUserCart,
  getLoggedUserCart,
  removeProductFromCart,
  clearLoggedUserCart,
} = require("../services/cartService");

const { protect, allowedTo } = require("../services/authService");

router
  .route("/")
  .post(
    protect,
    allowedTo("user"),

    createUserCart
  )
  .get(protect, allowedTo("user"), getLoggedUserCart)
  .delete(protect, allowedTo("user"), clearLoggedUserCart);
router
  .route("/:itemId")
  .delete(protect, allowedTo("user"), removeProductFromCart);

module.exports = router;
