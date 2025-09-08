const express = require("express");

const router = express.Router();
const {
  createCashOrder,
  getAllOrder,
  getSpecificOrder,
  filterOrderForLoggeddUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");

const { protect, allowedTo } = require("../services/authService");
router
  .route("/createCashOrder/:cartId")
  .post(protect, allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    protect,
    allowedTo("user", "admin", "manager"),
    filterOrderForLoggeddUser,
    getAllOrder
  );

router
  .route("/:id")
  .get(protect, allowedTo("user", "admin", "manager"), getSpecificOrder);

router
  .route("/:id/pay")
  .put(protect, allowedTo("admin", "manager"), updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(protect, allowedTo("admin", "manager"), updateOrderToDelivered);

router
  .route("/checkout/:cartId")
  .post(protect, allowedTo("user"), checkoutSession);

module.exports = router;
