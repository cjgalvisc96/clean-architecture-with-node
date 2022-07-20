const mongoose = require("mongoose");

const { Schema } = mongoose;

module.exports = new Schema({
  name: String,
  lastName: String,
  gender: Number,
  deleteAt: Date,
  updateAt: Date,
});
