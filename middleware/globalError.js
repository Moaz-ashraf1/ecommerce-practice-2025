const AppError = require("../utilis/ApiError");

const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();

    sendErrorForProd(err, res);
  }
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token, please login again", 401);
const handleTokenExpiredError = () =>
  new AppError("Expried token, please login again", 401);
const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorMiddleware;
