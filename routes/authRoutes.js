const express = require("express");
const { register, login } = require("../controllers/authController.js");

const router = express.Router();
const blacklist = new Set(); // Temporary in-memory token blacklist (Consider using Redis in production)

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Logout user
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  
  // Add token to blacklist
  blacklist.add(token);
  res.json({ message: "Logged out successfully" });
});

// Middleware to check if the token is blacklisted
const isTokenBlacklisted = (token) => {
  return blacklist.has(token); // Check if token exists in blacklist
};

// Example of using the blacklist check middleware
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from request

  if (token && isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token has been blacklisted. Please log in again." });
  }
  next(); // Continue processing the request if token is not blacklisted
});

module.exports = router;
module.exports.blacklist = blacklist; // Export blacklist separately (can be used for testing or future enhancements)
