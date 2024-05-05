const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authmiddleware");
const {
  completeGoodsPurchase,
  getCurrentOrderInfo,
} = require("../controller/order");

router.post("/completeOrder", requireAuth, completeGoodsPurchase);
router.get("/info/:orderId", requireAuth, getCurrentOrderInfo);

module.exports = router;
