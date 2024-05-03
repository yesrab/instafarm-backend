const mongoose = require("mongoose");
const { isURL } = require("validator");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [1, "Please add a valid price"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    image: {
      type: String,
      validate: [isURL, "Please add a valid url"],
      required: [true, "Please add a image url"],
    },
  },
  { timestamps: true }
);
const products = mongoose.model("products", productSchema);
module.exports = products;
