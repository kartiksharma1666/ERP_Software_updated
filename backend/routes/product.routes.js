const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

// Set CORS headers (if needed)
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Define routes
router.get("/all", productController.getProducts);
router.post("/create", productController.createProduct);
router.patch("/update", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
