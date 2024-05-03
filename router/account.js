const express = require("express");
const router = express.Router();

const { test, createAccount, login } = require("../controller/account");

router.route("/test").get(test);
router.route("/create").post(createAccount);
router.route("/login").post(login);
module.exports = router;
