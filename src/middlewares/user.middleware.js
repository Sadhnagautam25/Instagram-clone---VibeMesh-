const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

async function IdentifyUser(req, res, next) {
  try {
    const token = req.cookies?.token;

    // 1️⃣ Check token exists
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token ⚠️",
      });
    }

    // 2️⃣ Check token is blacklisted
    const isTokenBlacklisted = await blackListModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted ⚠️",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token ❌",
    });
  }
}

module.exports = IdentifyUser;
