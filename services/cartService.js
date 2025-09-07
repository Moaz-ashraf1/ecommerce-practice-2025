const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const ApiError = require("../utilis/ApiError");

const calculateTotalCartPrice = (cart) => {
  let totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return totalCartPrice;
};
exports.createUserCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  let product = await Product.findById(req.body.product);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // if cart not found, create new cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.product,
          color: req.body.color,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  } else {
    // if cart is found
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.product &&
        item.color === req.body.color
    );

    if (productIndex > -1) {
      // نفس المنتج + نفس اللون → نزود الكمية
      cart.cartItems[productIndex].quantity += 1;
    } else {
      // إما المنتج جديد أو نفس المنتج بلون مختلف → نضيف entry جديد
      cart.cartItems.push({
        product: product._id,
        color: req.body.color,
        price: product.price,
        quantity: 1,
      });
    }
  }

  // calculate total cart price
  let totalCartPrice = calculateTotalCartPrice(cart);

  cart.totalCartPrice = totalCartPrice; // ممكن تخزنها في الـ cart لو عندك field

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",

    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    message: "User cart fetched successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  let totalCartPrice = calculateTotalCartPrice(cart);
  cart.totalCartPrice = totalCartPrice;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from cart successfully",
    data: cart,
  });
});

exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).json({
    status: "success",
    message: "User cart cleared successfully",
  });
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity += req.body.quantity;
    cart.totalCartPrice = calculateTotalCartPrice(cart);
  } else {
    return next(
      new ApiError(` There is no item for this id :${req.params.itemId}`, 404)
    );
  }

  await cart.save();
  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404)
    );
  }

  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`Coupon is invaild or expired`, 404));
  }

  // apply discount
  const discount = (cart.totalCartPrice * coupon.discount) / 100;
  cart.totalCartPriceAfterDiscount = (cart.totalCartPrice - discount).toFixed(
    2
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: cart,
  });
});
