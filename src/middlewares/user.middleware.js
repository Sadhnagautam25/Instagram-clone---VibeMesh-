const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

async function IdentifyUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No Token ⚠️",
    });
  }

  const isTokenBlacklisted = await blackListModel.findOne({ token });

  if (isTokenBlacklisted) {
    res.status(401).json({
      message: "Token is blacklisted ⚠️",
    });
  }

  let decorded;
  try {
    decorded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  req.user = decorded;
  next();
}

module.exports = IdentifyUser;
