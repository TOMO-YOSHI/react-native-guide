const express = require("express");
const router = express.Router();

const { getUsers, postUsers } = require("../controllers/usersController");

router.get("/", getUsers).post("/", postUsers);

module.exports = router;
