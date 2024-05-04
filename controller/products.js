const productsSchema = require("../model/productSchema");
const data = require("../products.json");
const initProducts = async (req, res) => {
  await productsSchema.deleteMany({});
  const addedData = await productsSchema.insertMany(data);
  res.json({ addedData });
};

const getAllProducts = async (req, res) => {
  const allProducts = await productsSchema.find();
  res.status(200).json({ allProducts, status: "success" });
};

module.exports = { initProducts, getAllProducts };
