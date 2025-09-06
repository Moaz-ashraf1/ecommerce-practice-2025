const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("../utilis/ApiError");

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
  }

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
      new AppError(`There is no cart for this user id: ${req.user._id}`, 404)
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
      new AppError(`There is no cart for this user id: ${req.user._id}`, 404)
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

  res.status(200).json({
    status: "success",
    message: "User cart cleared successfully",
  });
});
