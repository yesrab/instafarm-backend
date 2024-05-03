const express = require("express");
const router = express.Router();

const { test, createAccount } = require("../controller/account");

router.route("/test").get(test);
router.route("/create").post(createAccount);
module.exports = router;
