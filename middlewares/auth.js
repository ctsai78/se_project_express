const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");
const { NOT_AUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(NOT_AUTHORIZED)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(NOT_AUTHORIZED)
      .send({ message: "Authorization Required" });
  }

  req.user = payload;

  return next();
};
