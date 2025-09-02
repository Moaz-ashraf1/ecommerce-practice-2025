const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../utilis/ApiError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users/images");
  },

  filename(req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `user-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG, and JPG are allowed.",
        400
      ),
      false
    );
  }
};
const upload = multer({ storage, fileFilter });
