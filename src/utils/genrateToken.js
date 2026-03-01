const jwt = require("jsonwebtoken");

function genrateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
}


module.exports = genrateToken;