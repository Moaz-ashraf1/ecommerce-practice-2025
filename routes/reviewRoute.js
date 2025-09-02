const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdToBody,
} = require("../services/reviewService");

const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utilis/validators/reviewValidator");

const { protect, allowedTo } = require("../services/authService");
router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    protect,
    allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
