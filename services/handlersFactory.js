const asyncHandler = require("express-async-handler");
const ApiError = require("../utilis/ApiError");
const ApiFeatures = require("../utilis/apiFeatures");

exports.createOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const newOne = await model.create(req.body);
    res.status(201).json({ data: newOne });
  });

exports.getAll = (model) =>
  asyncHandler(async (req, res) => {
    const numOfDocuments = await model.countDocuments();
    const apiFeature = new ApiFeatures(
      model.find(req.filterObject || {}),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate(numOfDocuments);

    const { mongooseQuery, paginationResult } = await apiFeature;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById(id);

    if (!document) {
      return next(new ApiError(`No document For This Id ${id}`, 404));
    }
    res.status(200).json({ document });
  });

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document For This Id ${id}`, 404));
    }

    res.status(200).send();
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    );
    console.log(document);
    if (!document) {
      return next(
        new ApiError(`No Document For This Id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ document });
  });
