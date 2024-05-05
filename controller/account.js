const test = (req, res) => {
  res.json({ lol: "lol" });
};

const accountSchema = require("../model/accountSchema");
const cartSchema = require("../model/cartSchema");
const orderSchema = require("../model/orderSchema");
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
  // console.log(account);
  res.status(200).json({ status: "success", credits: account.credits });
};

const purchaseCredits = async (req, res) => {
  const { id, name } = res.locals.tokenData;
  const { amount, purchasedCredits } = req.body;
  console.log(amount, purchasedCredits);
  const account = await accountSchema.findById(id);
  const { credits } = account;
  // const newCredits = credits + purchasedCredits;
  // const updatedAccount = await accountSchema.findByIdAndUpdate(id, {
  //   credits: newCredits,
  // });

  const order = {
    customerId: id,
    customerName: account.name,
    orderStatus: "ACTIVE",
    grandTotal: amount,
    orderType: "credit",
    orderdItems: [
      {
        productId: null,
        productName: `Credit value ${purchasedCredits}`,
        quantity: 1,
        productRate: amount,
      },
    ],
  };
  const createdOrder = await orderSchema.create(order);

  const options = {
    method: "POST",
    headers: {
      "accept": "application/json",
      "x-api-version": "2023-08-01",
      "content-type": "application/json",
      "x-client-id": process.env.AppID,
      "x-client-secret": process.env.Secret_Key,
    },
    body: JSON.stringify({
      customer_details: {
        customer_id: id,
        customer_email: account.email,
        customer_phone: account.mobileNumber,
        customer_name: account.name,
      },
      order_id: createdOrder._id,
      order_amount: amount,
      order_currency: "INR",
    }),
  };
  try {
    const cashFreeResponse = await fetch(
      "https://sandbox.cashfree.com/pg/orders",
      options
    );
    const cashFreeData = await cashFreeResponse.json();
    return res.status(202).json({
      status: "success",
      orderId: createdOrder._id,
      message: `${purchasedCredits} credits added`,
      sessionID: cashFreeData.payment_session_id,
    });
  } catch (e) {
    console.log(e);
  }

  res.status(202).json({
    status: "success",
    orderId: createdOrder._id,
    message: `${purchasedCredits} credits added`,
  });
};

module.exports = {
  test,
  createAccount,
  login,
  getCreditCount,
  purchaseCredits,
};
