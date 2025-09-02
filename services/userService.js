const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bycrypt = require("bcryptjs");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const AppError = require("../utilis/ApiError");

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

exports.uploadProfileImage = uploadSingleImage("profileImage");

exports.resizeProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const fileName = `user-${uuidv4()}-${Date.now()}-profile.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/users/images/${fileName}`);

  req.body.profileImage = fileName;
  next();
});

exports.createUser = factory.createOne(User);

exports.getUser = factory.getOne(User);

exports.getUsers = factory.getAll(User);

exports.createUser = factory.createOne(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    { new: true }
  );

  if (!document) {
    return next(new AppError(`No Document For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({ document });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      password: await bycrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(new AppError(`No Document For This Id ${req.params.id}`, 404));
  }
  res.status(200).json({ document });
});

exports.deleteUser = factory.deleteOne(User);

exports.getLoggodUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      password: await bycrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      phone: req.body.email,
      name: req.body.name,
    },
    { new: true }
  );

  res.status(200).json({
    data: user,
  });
});

exports.deleteLoggoedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    { new: true }
  );

  res.status(204).send();
});
