// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const db = require("../db.js");
// require("dotenv").config(); // Load environment variables

// // ✅ REGISTER USER
// exports.register = (req, res) => {
//   const { name, email, password } = req.body;

//   // 🔹 Validate input fields
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   // 🔹 Check if user already exists
//   db.query("SELECT id FROM users WHERE email = ? OR name = ?", [email, name], (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });

//     if (results.length > 0) {
//       return res.status(409).json({ error: "Email or name already exists. Please use a different one." });
//     }

//     // 🔹 Hash the password before storing
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], (insertErr) => {
//       if (insertErr) return res.status(500).json({ error: "Database error: " + insertErr.message });

//       res.status(201).json({ message: "User registered successfully!" });
//     });
//   });
// };

// // ✅ LOGIN USER
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });

//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const user = results[0];

//     if (user.status === "blocked") {
//       return res.status(403).json({ error: "User is blocked" });
//     }

//     const isMatch = bcrypt.compareSync(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Update last_login only on successful login
//     db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id], (updateErr) => {
//       if (updateErr) console.error("Failed to update last_login:", updateErr.message);
//     });

//     res.json({ token, user });
//   });
// };



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js");
require("dotenv").config();

// 🔹 Common function to handle database query errors
const handleDbError = (err, res) => {
  return res.status(500).json({ error: `Database error: ${err.message}` });
};

// ✅ REGISTER USER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [results] = await db.promise().query("SELECT id FROM users WHERE email = ? OR name = ?", [email, name]);

    if (results.length > 0) {
      return res.status(409).json({ error: "Email or name already exists. Please use a different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    handleDbError(err, res);
  }
};

// ✅ LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [results] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    if (user.status === "blocked") {
      return res.status(403).json({ error: "User is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await db.promise().query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

    res.json({ token, user });
  } catch (err) {
    handleDbError(err, res);
  }
};

