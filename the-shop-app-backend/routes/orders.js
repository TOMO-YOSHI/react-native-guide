const express = require("express");
const router = express.Router();
const VerifyToken = require("../middlewares/verifyToken");

const { getOrders, postOrders } = require("../controllers/ordersController");

// orders routes
router.get("/", VerifyToken, getOrders).post("/", VerifyToken, postOrders);

module.exports = router;
