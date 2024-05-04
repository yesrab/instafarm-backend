const test = (req, res) => {
  res.json({ lol: "lol" });
};

const accountSchema = require("../model/accountSchema");
const cartSchema = require("../model/cartSchema");
const jwt = require("jsonwebtoken");
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
const generateToken = (idObj) => {
  return jwt.sign(idObj, secrete);
};
const createAccount = async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  const createdAcc = await accountSchema.create({
    name,
    email,
    mobileNumber,
    password,
  });
  if (createdAcc) {
    const {
      _id,
      name: savedName,
      email: savedEmail,
      mobileNumber: number,
    } = createdAcc;
    const id = _id.toString();

    const cart = await cartSchema.create({
      customerId: id,
      customerName: savedName,
    });

    const token = generateToken({ id, name: savedName, email: savedEmail });
    return res.status(201).json({
      id: id,
      name: savedName,
      email: savedEmail,
      mobileNumber: number,
      message: "account created!",
      status: "success",
      token,
      cart,
    });
  }
  res
    .status(201)
    .json({ createdAcc, cart, message: "account created!", status: "success" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await accountSchema.login(email, password);
  const { _id, name, mobile, email: resEmail } = user;
  const id = _id.toString();
  const token = generateToken({ id, name, email: resEmail });
  res
    .status(202)
    .json({ id, mobile, name, email: resEmail, token, status: "success" });
};

const getCreditCount = async (req, res) => {
  const { id, name } = res.locals.tokenData;
  const account = await accountSchema.findById(id);
  console.log(account);
  res.status(200).json({ status: "success", credits: account.credits });
};

module.exports = { test, createAccount, login, getCreditCount };
