const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    Message: "Product added successfully to wishlist",
    wishlist: user.wishlist,
  });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    Message: "Product removed successfully from wishlist",
    wishlist: user.wishlist,
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    success: true,
    results: user.wishlist.length,
    wishlist: user.wishlist,
  });
});
