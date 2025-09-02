const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utilis/ApiError");
const sendMail = require("../utilis/sendEmail");

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  const token = createToken({ userId: user._id });

  res.status(201).json({
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = createToken({ userId: user._id });

  res.status(200).json({ data: user, token });
});

// @desc make sure that user is logged in before accessing protected routes
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to access this route",
        401
      )
    );
  }

  // 2) verify token (no change happens,)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  console.log(decoded);
  const currentUser = await User.findOne({ _id: decoded.payload.userId });
  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // 4) check if user changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const passwordChangedAt = Math.floor(
      currentUser.passwordChangedAt.getTime() / 1000
    );
    if (passwordChangedAt > decoded.iat) {
      next(new AppError("User has changed password. Please log in again", 401));
    }
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to access this route", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`No user found with this email ${req.body.email}`, 404)
    );
  }

  // 2) if user exist generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = await crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // 3) save hashed password reset code into db
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 0.5 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 4) send email to user with reset link
  try {
    await sendMail({
      to: user.email,
      subject: "Password Reset",
      message: `Your password reset code is ${resetCode}. Please use this code to reset your password. Expires in 10 minutes`,
      resetCode: resetCode,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new AppError(`there is an error in sending email`, 500));
  }

  res.status(200).json({
    message: `Password reset code sent to ${user.email}`,
  });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = await crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(`Reset code invaild or expired`));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Reset code verified successfully",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user with email ${req.body.email} `, 404)
    );
  }

  if (!user.passwordResetVerified) {
    return next(new AppError(`reset code not verified`, 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
