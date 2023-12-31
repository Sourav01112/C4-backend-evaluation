const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const tokenExists = req.headers.authorization?.split(" ")[1];
  if (tokenExists) {
    try {
      const decoded = jwt.verify(tokenExists, process.env.JWT_SECRET_KEY);
      if (decoded) {
        req.body.userID = decoded.userID;
        req.body.user = decoded.userID;
        next();
      } else {
        res.status(200).json({ msg: "Not Authorized" });
      }
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  } else {
    res.status(400).json({ msg: "please login!" });
  }
};

module.exports = { authMiddleware };
