const mongoose = require("mongoose");
const accountError = require("../errors/accountError");
const cartError = require("../errors/cartError");
const globalErrorHandler = (error, request, response, next) => {
  console.log("message from global handler", error);
  if (error.code === 11000) {
    return accountError(error, request, response);
  }
  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "Account validation failed"
  ) {
    return accountError(error, request, response);
  }

  if (
    error instanceof mongoose.Error.ValidationError &&
    error._message === "Cart validation failed"
  ) {
    return cartError(error, request, response);
  }

  return response.status(error.statusCode || 500).json({
    message: "You have triggered the server's global error handler",
    error: error.message,
    status: "Error",
  });
};
module.exports = globalErrorHandler;
