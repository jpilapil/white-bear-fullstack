require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function validateJwt(req, res, next) {
  const accessToken = req.header("x-auth-token");

  if (!accessToken) {
    return res.status(401).json({ authError: "No token provided." });
  }

  try {
    // verify the token
    // if valid, extract user payload
    const decodedPayload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    // assign payload to request
    req.user = decodedPayload;
    // continue in the api
    next();
  } catch {
    return res.status(401).json({ authError: "Unauthorized token." });
  }
};
