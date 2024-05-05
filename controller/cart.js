const cartSchema = require("../model/cartSchema");
const productSchema = require("../model/productSchema");
const orderSchema = require("../model/orderSchema");
const customerSchema = require("../model/accountSchema");
const addProductToCart = async (req, res) => {
  const { id } = res.locals.tokenData;
  const { productId: prID } = req.body;
  const customerCart = await cartSchema.findOne({ customerId: id });
  const referenceProduct = await productSchema.findById(prID);

  const existingProductIndex = customerCart?.cartItems?.findIndex(
    (item) => item.productId.toString() === prID
  );
  if (existingProductIndex !== -1) {
    customerCart.cartItems[existingProductIndex].productQuantity += 1;
  } else {
    const { name, price, image } = referenceProduct;
    customerCart.cartItems.push({
      productName: name,
      productId: prID,
      productRate: price,
      image: image,
    });
  }
  await customerCart.save();
  res.status(202).json({
    customerCart,
    status: "success",
    message: `added ${referenceProduct.name} to the cart`,
  });
};

const getCartData = async (req, res) => {
  const { id } = res.locals.tokenData;
  const customerCart = await cartSchema.findOne({ customerId: id });
  res.status(200).json(customerCart);
};

const editProductQuantity = async (req, res) => {
  const { id } = res.locals.tokenData;
  const { productId, quantity } = req.body;
  const customerCart = await cartSchema.findOne({ customerId: id });
  const productIndex = customerCart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (quantity === 0) {
    customerCart.cartItems.splice(productIndex, 1);
    await customerCart.save();
    res.status(202).json({
      customerCart,
      status: "success",
      message: `product with id ${productId} removed from the cart`,
    });
  } else {
    customerCart.cartItems[productIndex].productQuantity = quantity;
    await customerCart.save();
    res.status(202).json({
      customerCart,
      status: "success",
      message: `quantity of product with id ${productId} updated to ${quantity}`,
    });
  }
};

const purchaseCart = async (req, res) => {
  const { id } = res.locals.tokenData;
  const customerCart = await cartSchema.findOne({ customerId: id });
  const custormr = await customerSchema.findById(id);
  if (custormr.credits < customerCart.grandTotal) {
    return res.status(200).json({
      error: "Insufficient funds",
      message: "Insufficient Credits to continue Checkout",
    });
  }
  const { customerName, cartItems } = customerCart;
  const order = await orderSchema.create({
    customerName,
    customerId: id,
    orderdItems: cartItems,
  });
  customerCart.cartItems = [];
  await customerCart.save();
  res.status(201).json({
    order,
    orderId: order._id,
    status: "success",
    message: "cart purchase initiated",
  });
};

module.exports = {
  addProductToCart,
  getCartData,
  editProductQuantity,
  purchaseCart,
};
