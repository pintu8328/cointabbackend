const mongoose = require("mongoose");
require("dotenv").config();
const DB = process.env.DATABASE;
const connection = mongoose.connect(DB);
module.exports = connection;
