const orderSchema = require("../model/orderSchema");
const customerSchema = require("../model/accountSchema");

const completeGoodsPurchase = async (req, res) => {
  const { id } = res.locals.tokenData;
  const { orderId, address } = req.body;
  console.log(orderId, address);

  const order = await orderSchema.findById(orderId);
  const customerDetails = await customerSchema.findById(id);
  const { grandTotal, orderStatus } = order;

  if (order.grandTotal > customerDetails.credits) {
    return res.status(400).json({
      status: "failed",
      message: "Insufficient credit balance",
    });
  }
  const newCreditBalance =
    parseInt(customerDetails.credits) - parseInt(order.grandTotal) || 0;
  order.address = address;
  order.orderStatus = "PAID";
  console.log(newCreditBalance, "this is the new credit balance");
  customerDetails.credits = newCreditBalance;
  await customerDetails.save();
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Goods purchase completed successfully",
  });
};

const getCurrentOrderInfo = async (req, res) => {
  console.log("orderid hot");
  const { orderId } = req.params;
  const { id } = res.locals.tokenData;
  const customerDetails = await customerSchema.findById(id);
  const currentOrder = await orderSchema.findById(orderId);
  res.status(200).json({
    status: "success",
    currentOrder,
    customerCredits: customerDetails.credits,
  });
};

module.exports = { completeGoodsPurchase, getCurrentOrderInfo };
