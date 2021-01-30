const express = require("express");
const router = express.Router();
const VerifyToken = require("../middlewares/verifyToken");

const {
    getProducts,
    postProducts,
    deleteProducts,
    updateProducts,
} = require("../controllers/productsController");

// Products routes
router
    .get("/", getProducts)
    .post("/", VerifyToken, postProducts)
    .delete("/:product_id", VerifyToken, deleteProducts)
    .put("/:product_id", VerifyToken, updateProducts);

module.exports = router;
