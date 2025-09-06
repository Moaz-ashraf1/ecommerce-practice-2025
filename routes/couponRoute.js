const express = require("express");

const router = express.Router();

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
