const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

// orders routes
router.post("/", login);

module.exports = router;
