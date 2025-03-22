// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed: ", err);
//   } else {
//     console.log("Connected to MySQL database!");
//   }
// });

// module.exports = db;


const mysql = require("mysql2");

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack); // Provide more detailed error information
    process.exit(1); // Exit the process in case of a database connection failure
  } else {
    console.log("Connected to MySQL database!");
  }
});

// Export the database connection
module.exports = db;

