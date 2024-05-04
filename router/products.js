const express = require("express");
const router = express.Router();

const { initProducts, getAllProducts } = require("../controller/products");

router.route("/init").get(initProducts);
router.route("/allProducts").get(getAllProducts);
module.exports = router;
