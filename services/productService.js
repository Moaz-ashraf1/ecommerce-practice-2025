const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");
const ApiError = require("../utilis/ApiError");
const parseQuery = require("../utilis/queryParser");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

exports.getProduct = factory.getOne(Product);

exports.getProducts = factory.getAll(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
