const express = require("express");
const router = express.Router();

const productsRouter = require("./products");
const ordersRouter = require("./orders");
const signupRouter = require("./signup");
const loginRouter = require("./login");
const tokenRouter = require("./token");
const usersRouter = require("./users");

router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/signup", signupRouter);
router.use("/login", loginRouter);
router.use("/token", tokenRouter);

// TEST PURPOSE ONLY ************
// router.use("/users", usersRouter);
// ******************************

module.exports = router;
