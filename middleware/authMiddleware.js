const jwt = require("jsonwebtoken");
const blacklist = require("../routes/authRoutes").blacklist; //  Import blacklist correctly

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied, no token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header

  //  Check if the token is blacklisted (i.e., user logged out)
  if (blacklist.has(token)) {
    return res.status(403).json({ message: "Token is no longer valid. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify token
    req.user = decoded; // Attach decoded user to the request object
    next(); //  Allow request to proceed
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Session expired. Please log in again." });
    }
    return res.status(400).json({ message: "Invalid token" });
  }
};
