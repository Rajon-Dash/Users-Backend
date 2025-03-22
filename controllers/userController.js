

// const db = require("../db.js");

// // Middleware: Check if user exists & isn't blocked before every request (except login/register)
// exports.authMiddleware = (req, res, next) => {
//   const userId = req.user?.id;
//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized access!" });
//   }

//   db.query("SELECT status FROM users WHERE id = ?", [userId], (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });

//     if (results.length === 0) {
//       return res.status(401).json({ error: "User not found. Please log in again." });
//     }

//     if (results[0].status === "blocked") {
//       return res.status(403).json({ error: "Your account is blocked. Please contact admin." });
//     }

//     next();
//   });
// };

// // Get users & ensure last_login is always valid
// exports.getUsers = (req, res) => {
//   db.query(
//     `SELECT id, name, email, 
//       IFNULL(UNIX_TIMESTAMP(last_login) * 1000, 0) AS last_login, 
//       UNIX_TIMESTAMP(created_at) * 1000 AS created_at, 
//       status 
//     FROM users 
//     ORDER BY last_login DESC`,
//     (err, results) => {
//       if (err) return res.status(500).json({ error: "Database error: " + err.message });
//       res.json(results);
//     }
//   );
// };

// // Block users (including self-blocking)
// exports.blockUsers = (req, res) => {
//   const { userIds } = req.body;
//   if (!userIds || userIds.length === 0) {
//     return res.status(400).json({ error: "No user IDs provided" });
//   }

//   db.query("UPDATE users SET status = 'blocked' WHERE id IN (?)", [userIds], (err) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });

//     // If the current user blocked themselves, log them out
//     if (userIds.includes(req.user.id)) {
//       return res.status(200).json({ message: "You blocked yourself! Redirecting to login...", logout: true });
//     }

//     res.json({ message: "Users blocked successfully" });
//   });
// };

// // Unblock users
// exports.unblockUsers = (req, res) => {
//   const { userIds } = req.body;
//   if (!userIds || userIds.length === 0) {
//     return res.status(400).json({ error: "No user IDs provided" });
//   }

//   db.query("UPDATE users SET status = 'active' WHERE id IN (?)", [userIds], (err) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });
//     res.json({ message: "Users unblocked successfully" });
//   });
// };

// // Delete users (including self-deletion)
// exports.deleteUsers = (req, res) => {
//   const { userIds } = req.body;
//   if (!userIds || userIds.length === 0) {
//     return res.status(400).json({ error: "No user IDs provided" });
//   }

//   db.query("DELETE FROM users WHERE id IN (?)", [userIds], (err) => {
//     if (err) return res.status(500).json({ error: "Database error: " + err.message });

//     // If the current user deleted themselves, log them out
//     if (userIds.includes(req.user.id)) {
//       return res.status(200).json({ message: "You deleted yourself! Redirecting to login...", logout: true });
//     }

//     res.json({ message: "Users deleted successfully" });
//   });
// };

// // Ensure Unique Index on Email (One-time database setup)
// exports.createUserTable = () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS users (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       name VARCHAR(255) NOT NULL UNIQUE ,
//       email VARCHAR(255) NOT NULL UNIQUE,
//       password VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       last_login TIMESTAMP NULL DEFAULT NULL,
//       status ENUM('active', 'blocked') DEFAULT 'active'
//     );
//   `;
//   db.query(createTableQuery, (err) => {
//     if (err) console.error("Error creating user table:", err.message);
//     else console.log("User table ensured.");
//   });
// };


const db = require("../db.js");

// Middleware: Check if user exists & isn't blocked before every request (except login/register)
exports.authMiddleware = (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized access!" });
  }

  db.query("SELECT status FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    if (results[0].status === "blocked") {
      return res.status(403).json({ error: "Your account is blocked. Please contact admin." });
    }

    next();
  });
};

// Get users & ensure last_login is always valid
exports.getUsers = (req, res) => {
  db.query(
    `SELECT id, name, email, 
      IFNULL(UNIX_TIMESTAMP(last_login) * 1000, 0) AS last_login, 
      UNIX_TIMESTAMP(created_at) * 1000 AS created_at, 
      status 
    FROM users 
    ORDER BY last_login DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      res.json(results);
    }
  );
};

// Block users (including self-blocking)
exports.blockUsers = (req, res) => {
  const { userIds } = req.body;
  if (!userIds?.length) {
    return res.status(400).json({ error: "No user IDs provided" });
  }

  db.query("UPDATE users SET status = 'blocked' WHERE id IN (?)", [userIds], (err) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });

    if (userIds.includes(req.user.id)) {
      return res.status(200).json({ message: "You blocked yourself! Redirecting to login...", logout: true });
    }

    res.json({ message: "Users blocked successfully" });
  });
};

// Unblock users
exports.unblockUsers = (req, res) => {
  const { userIds } = req.body;
  if (!userIds?.length) {
    return res.status(400).json({ error: "No user IDs provided" });
  }

  db.query("UPDATE users SET status = 'active' WHERE id IN (?)", [userIds], (err) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    res.json({ message: "Users unblocked successfully" });
  });
};

// Delete users (including self-deletion)
exports.deleteUsers = (req, res) => {
  const { userIds } = req.body;
  if (!userIds?.length) {
    return res.status(400).json({ error: "No user IDs provided" });
  }

  db.query("DELETE FROM users WHERE id IN (?)", [userIds], (err) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });

    if (userIds.includes(req.user.id)) {
      return res.status(200).json({ message: "You deleted yourself! Redirecting to login...", logout: true });
    }

    res.json({ message: "Users deleted successfully" });
  });
};

// Ensure Unique Index on Email and Name (One-time database setup)
exports.createUserTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL DEFAULT NULL,
      status ENUM('active', 'blocked') DEFAULT 'active'
    );
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) console.error("Error creating user table:", err.message);
    else console.log("User table ensured.");
  });
};
