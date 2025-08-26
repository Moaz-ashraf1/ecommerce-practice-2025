const mongoose = require("mongoose");

const userSchema = new mongoose.schema({}, {});

module.exports = mongoose.model("User", userSchema);
