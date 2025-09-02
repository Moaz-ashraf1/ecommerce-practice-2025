const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const qs = require("qs");

dotenv.config({
  path: "config.env",
});
const AppError = require("./utilis/ApiError");
const globalError = require("./middleware/globalError");
const dbConnection = require("./config/database");

const categoryRoute = require("./routes/categoryRoute");
const subcategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");

// connect with db
dbConnection();

// Express App
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subcategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRoute);

// Handle Unhandled Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware For Express
app.use(globalError);

// Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle Error Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errosr: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down ...");
    process.exit(1);
  });
});
