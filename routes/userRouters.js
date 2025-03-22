const express = require("express");
const { getUsers, blockUsers, unblockUsers, deleteUsers } = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.post("/block", authMiddleware, blockUsers);
router.post("/unblock", authMiddleware, unblockUsers);
router.post("/delete", authMiddleware, deleteUsers);

module.exports = router;

