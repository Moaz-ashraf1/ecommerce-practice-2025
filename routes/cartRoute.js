const express = require("express");

const router = express.Router();

const {
  createUserCart,
  getLoggedUserCart,
  removeProductFromCart,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const { protect, allowedTo } = require("../services/authService");
router.put("/applyCoupon", protect, allowedTo("user"), applyCoupon);
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
  .put(protect, allowedTo("user"), updateCartItemQuantity)
  .delete(protect, allowedTo("user"), removeProductFromCart);

module.exports = router;
