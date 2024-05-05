//node server
const express = require("express");
require("dotenv").config();
require("express-async-errors");
const statusMonitor = require("express-status-monitor-plus");
const cors = require("cors");
//env
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB;
//env

//init express app
const app = express();

// load content function
const connectDB = require("./db/connect");

//cors middleware
app.use(cors());

//express body json parsing middleware
app.use(express.json());

//express url parsing middleware
app.use(express.urlencoded({ extended: false }));

app.use(
  statusMonitor({
    path: "/api/status",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
    status: "success",
    currentTime: new Date().toISOString(),
    path: req.path,
    url: req.originalUrl,
  });
});

app.get("/api/message", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
    status: "success",
    currentTime: new Date().toISOString(),
    path: req.path,
    url: req.originalUrl,
  });
});

//account route
const accountRoute = require("./router/account");
app.use("/api/v1/account", accountRoute);
//account route

//products route
const productsRoute = require("./router/products");
app.use("/api/v1/products", productsRoute);
//products route

//cart route
const cartRoute = require("./router/cart");
app.use("/api/v1/cart", cartRoute);
//cart route

//order route
const orderRoute = require("./router/order");
app.use("/api/v1/order", orderRoute);
//order route

//global error handler middleware
const globalErrorHandler = require("./middleware/globalErrorHandler");
app.use(globalErrorHandler);

//start server and connet to db
const startServer = async () => {
  try {
    await connectDB(DB_URI);
    console.log("DB connected");
    app.listen(PORT, () => {
      console.clear();
      console.log(`Server Started at port ${PORT}`);
      console.log("");
      console.log("\x1b[36m%s\x1b[0m", `http://localhost:${PORT}/`);
      console.log("^ click here");
      console.log("");
    });
  } catch (error) {
    console.log(error);
  }
};

//start express app
startServer();
