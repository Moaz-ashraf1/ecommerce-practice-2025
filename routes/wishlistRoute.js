const express = require("express");
const router = express.Router();

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistServices");
const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishlist);
router.route("/:productId").delete(removeProductFromWishlist);
router.route("/").get(getLoggedUserWishlist);

module.exports = router;
