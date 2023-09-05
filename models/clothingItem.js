const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: String,
    format: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
