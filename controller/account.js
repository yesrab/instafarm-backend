const test = (req, res) => {
  res.json({ lol: "lol" });
};

const createAccount = async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;
  res.json({ name, email, mobileNumber, password });
};

module.exports = { test, createAccount };
