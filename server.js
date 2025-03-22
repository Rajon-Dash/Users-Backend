// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRouters");

// const app = express();

// // ✅ Configure CORS to allow frontend access
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000", // ✅ Change in production
//   methods: "GET,POST,PUT,DELETE,OPTIONS",
//   allowedHeaders: "Content-Type,Authorization",
//   credentials: true, // ✅ Needed for authentication (cookies, JWT, etc.)
// }));

// // ✅ Middleware
// app.use(express.json()); // Parse JSON requests

// // ✅ API Routes
// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);

// // ✅ 404 Handler (for undefined routes)
// app.use((req, res, next) => {
//   res.status(404).json({ error: "API route not found" });
// });

// // ✅ Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// // ✅ Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRouters");

const app = express();

// ✅ Configure CORS to allow frontend access
app.use(cors({
  origin: process.env.CLIENT_URL, // Change in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Required for cookies, JWT, etc.
}));

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// ✅ 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Global Error Handler for uncaught errors
app.use((err, req, res, next) => {
  console.error("Error:", err.stack); // Log error stack for debugging
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
