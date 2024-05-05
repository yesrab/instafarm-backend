const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "please add customer name for the order"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "please enter account id of the customer"],
      unique: true,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    cartItems: {
      type: [
        {
          productName: {
            type: String,
            required: [true, "please enter product name"],
          },
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          productQuantity: {
            type: Number,
            required: [true, "please enter product quantity"],
            default: 1,
          },
          productRate: {
            type: Number,
            required: [true, "product price is required"],
          },
          subTotal: {
            type: Number,
            default: 0,
          },
          image: {
            type: String,
            required: [true, "please enter product image"],
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.cartItems.forEach((productObj) => {
    productObj.subTotal = productObj.productRate * productObj.productQuantity; // Changed quantity to productQuantity
  });
  next();
});

cartSchema.pre("save", function (next) {
  let total = 0;
  this.cartItems.forEach((product) => {
    const subTotal = product.productRate * product.productQuantity; // Changed quantity to productQuantity
    total += subTotal;
  });
  this.grandTotal = total;
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
