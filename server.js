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
const mountRoute = require("./routes/mountRoute");

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
mountRoute(app);

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
