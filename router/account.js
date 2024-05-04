const express = require("express");
const router = express.Router();

const {
  test,
  createAccount,
  login,
  getCreditCount,
} = require("../controller/account");
const { requireAuth } = require("../middleware/authmiddleware");

router.route("/test").get(test);
router.route("/create").post(createAccount);
router.route("/login").post(login);
router.route("/creditCount").get(requireAuth, getCreditCount);
module.exports = router;
