const express = require("express");
const router = express.Router();

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");
const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress);
router.route("/:addressId").delete(removeAddress);
router.route("/").get(getLoggedUserAddresses);

module.exports = router;
