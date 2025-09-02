const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const multer = require("multer");

const Product = require("../models/productModel");
const ApiError = require("../utilis/ApiError");
const parseQuery = require("../utilis/queryParser");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");
const { uploadMixOfImage } = require("../middleware/uploadImageMiddleware");

exports.uplodProductImage = uploadMixOfImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const fileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/images/${fileName}`);

    req.body.imageCover = fileName;
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/images/${fileName}`);

        req.body.images.push(fileName);
      })
    );
  }

  next();
});

exports.getProduct = factory.getOne(Product, { path: "reviews" });

exports.getProducts = factory.getAll(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
