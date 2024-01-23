const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(411).json({
      message: "Malicious activity!!",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decodedValue = jwt.verify(token, SECRET_KEY);
  req.userId = decodedValue.userId;
  next();
};

module.exports = {
  validateToken,
};
