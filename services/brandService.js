const asynHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utilis/ApiError");
const brandModel = require("../models/brandModel");
const ApiFeatures = require("../utilis/apiFeatures");
const factory = require("./handlersFactory");

exports.createBrand = factory.createOne(brandModel);

exports.getBrands = factory.getAll(brandModel);

exports.getBrand = factory.getOne(brandModel);

exports.updateBrand = factory.updateOne(brandModel);

exports.deleteBrand = factory.deleteOne(brandModel);
