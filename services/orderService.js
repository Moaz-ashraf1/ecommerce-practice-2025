const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ApiError = require("../utilis/ApiError");
const { updateOne, bulkWrite } = require("../models/categoryModel");
const factory = require("./handlersFactory");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shipphingPrice = 0;
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId}`, 404)
    );
  }
  // 2) Get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shipphingPrice;

  // 3) create order with default paymentmethod cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shipphingAddresses: req.body.shipphingAddresses,
    totalOrderPrice,
  });

  // 4) decrement product qunatity, increment product sold

  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});
  }
  // 5) clear cart after order
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({ status: "sucess", data: order });
});

exports.filterOrderForLoggeddUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
});

exports.getAllOrder = factory.getAll(Order);
exports.getSpecificOrder = factory.getOne(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order for this id : ${req.params.id}`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = new Date();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(`There is no order for this id : ${req.params.id}`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shipphingPrice = 0;
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId}`, 404)
    );
  }
  // 2) Get order price depend on cart price "check if coupon apply"
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shipphingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice,
          product_data: {
            name: req.user.name,
          },
        },
      },
    ],

    metadata: req.body.shipphingAddress,
  });
  res.status(200).json({
    status: "success",
    session,
  });
});
