const express = require("express");
const router = express.Router();
const { authJwt, verify } = require("../middleware/_index");
const controller = require("../controllers/_index");

router.use((req, res, next) => {
  try {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  } catch (error) {
    console.log("error setHeader", error);
    res.status(404).send({ message: "Token expired! Please login." });
  }
});

router.get("/auth", [authJwt.verifyToken], (req, res) => {
  res.status(200).send();
});

router.post(
  "/register",
  [verify.checkDuplicateEmail],
  controller.account.onRegister
);
router.post("/login", controller.account.onLogin);
router.post(
  "/product",
  [authJwt.verifyToken, verify.checkDuplicateProduct],
  controller.product.newProduct
);

router.get("/product/:code", [
  authJwt.verifyToken,
  controller.product.getProductByCode,
]);
router.get("/product", [authJwt.verifyToken], controller.product.getAllProduct);
router.put("/product", [authJwt.verifyToken], controller.product.editProduct);
router.delete(
  "/product/:id",
  [authJwt.verifyToken],
  controller.product.deleteProduct
);

router.get("/stock", [authJwt.verifyToken], controller.stock.getAllStock);
router.put("/stock", [authJwt.verifyToken], controller.stock.cutProductStock);

router.post("/generate", [authJwt.verifyToken], controller.generate.getBarCode);

router.get("/test", [authJwt.verifyToken], (req, res) => {
  res.send({ message: "success" });
});

module.exports = router;
