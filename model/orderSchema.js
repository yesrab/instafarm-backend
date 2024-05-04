const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "please add customer name for the order"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "please enter account id of the customer"],
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    orderdItems: {
      type: [
        {
          productName: {
            type: String,
            required: [true, "please enter product name"],
          },
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: [true, "a valid product id is required"],
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
        },
      ],
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.orderdItems.forEach((productObj) => {
    productObj.subTotal = productObj.productRate * productObj.quantity;
  });
  next();
});

cartSchema.pre("save", function (next) {
  let total = 0;
  this.orderdItems.forEach((product) => {
    const subTotal = product.productRate * product.quantity;
    total += subTotal;
  });
  this.grandTotal = total;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
