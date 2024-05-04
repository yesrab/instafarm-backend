const jwt = require("jsonwebtoken");
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
const requireAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  // console.log("auth", req.body);
  if (token) {
    jwt.verify(token, secrete, (err, decoadedToken) => {
      if (err) {
        if (req.path == "/allProducts") {
          res.locals.tokenStatus = false;
          return next();
        }
        return res.status(401).json({ msg: err.message, status: "Error" });
      } else {
        res.locals.tokenStatus = true;
        res.locals.tokenData = decoadedToken;
        next();
      }
    });
  } else {
    if (req.path == "/creditCount") {
      res.locals.tokenStatus = false;
      return next();
    }
    res.status(401).json({
      msg: "token not found",
      status: "Error",
    });
  }
};
module.exports = { requireAuth };
