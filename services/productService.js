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

exports.getProduct = factory.getOne(Product);

exports.getProducts = factory.getAll(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

/*
{
    "title": "Menss Cotton Jacket",
    "slug": "mens-cotton-jacket",
    "quantity": 20,
    "sold": 75,
    "price": 55.99,
    "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    "category": "68a00f1f4d928d6bd5e7f680",

    "imageCover": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    "ratingsAverage": 4.0,
    "ratingsQuantity": 70
  }
*/
