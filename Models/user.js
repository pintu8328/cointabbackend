const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  count: Number,
  current_hour: Number,
  time: String,
  current_minute: Number,
  current_second: Number,
  current_year: Number,
  current_month: Number,
  current_date: Number,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
