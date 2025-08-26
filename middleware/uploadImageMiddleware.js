const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage({});
  const multerFilter = function (req, file, callback) {
    if (file.mimetype.startsWith("image")) {
      callback(null, true);
    } else {
      callback(
        new ApiError("Invalid file type, only images are allowed", 400),
        false
      );
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImage = (arryOfFields) =>
  multerOptions().fields(arryOfFields);
