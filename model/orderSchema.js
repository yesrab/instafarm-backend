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
    orderType: {
      type: String,
      enum: ["credit", "goods"],
      default: "goods",
    },
    orderStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "PAID",
        "EXPIRED",
        "TERMINATED",
        "TERMINATION_REQUESTED",
      ],
      default: "ACTIVE",
    },
    address: {
      type: String,
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
      default: [],
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.orderdItems.forEach((productObj) => {
    productObj.subTotal = productObj.productRate * productObj.productQuantity;
  });
  next();
});

orderSchema.pre("save", function (next) {
  let total = 0;
  this.orderdItems.forEach((product) => {
    const subTotal = product.productRate * product.productQuantity;
    total += subTotal;
  });
  this.grandTotal = total;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
