const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authmiddleware");
const {
  addProductToCart,
  getCartData,
  editProductQuantity,
  purchaseCart,
} = require("../controller/cart");

router.route("/addProduct").post(requireAuth, addProductToCart);
router.route("/getCartData").get(requireAuth, getCartData);
router.route("/editProductQuantity").patch(requireAuth, editProductQuantity);
router.route("/purchaseCart").post(requireAuth, purchaseCart);
module.exports = router;
