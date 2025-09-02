const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  resizeProfileImage,
  updateUserPassword,
  getLoggodUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggoedUser,
} = require("../services/userService");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utilis/validators/userValidators");

const upload = multer({ dest: "uploads/users/images" });

const { protect, allowedTo } = require("../services/authService");

router.route("/getMe").get(protect, getLoggodUserData, getUser);
router
  .route("/changeLoggedUserPassword")
  .put(protect, changeLoggedUserPassword);
router
  .route("/changePassword/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

router
  .route("/updateMe")
  .put(protect, updateLoggedUserValidator, updateLoggedUserData);

router.route("/deletMe").put(protect, deleteLoggoedUser);
router
  .route("/")
  .get(protect, allowedTo("admin", "manager"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    createUserValidator,
    uploadProfileImage,
    resizeProfileImage,
    createUser
  );
router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadProfileImage,
    resizeProfileImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
