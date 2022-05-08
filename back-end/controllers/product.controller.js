const db = require("../models/_index");

newProduct = async (req, res) => {
  try {
    const bodyProduct = {
      code: req.body.code.replace(/^\s+|\s+$/gm, ""),
      title: req.body.title,
      stock: req.body.stock,
      specification: req.body.specification,
      accountID: req.userID,
    };

    let result = await db.product.create(bodyProduct);
    const bodyStock = {
      quantity: req.body.stock,
      detail: "",
      addStock: true,
      accountID: req.userID,
      productID: result.id,
      code: req.body.code.replace(/^\s+|\s+$/gm, ""),
    };

    await db.stock.create(bodyStock);
    res.status(200).send({ message: "New product successfully!" });
  } catch (error) {
    console.log("error newProduct", error);
    res.status(500).send({ message: error });
  }
};

editProduct = async (req, res) => {
  try {
    const id = req.body.id;
    const code = req.body.code;
    const addStock = req.body.addStock;
    const bodyStock = {};
    let stock = req.body.stock;

    if (addStock < 0) addStock = 0;
    if (addStock != 0) {
      stock += addStock;

      bodyStock.quantity = addStock;
      bodyStock.detail = "";
      bodyStock.addStock = true;
      bodyStock.accountID = req.userID;
      bodyStock.productID = id;
      bodyStock.code = code;

      await db.stock.create(bodyStock);
    }

    const bodyProduct = {
      title: req.body.title,
      stock: stock,
      specification: req.body.specification,
    };

    await db.product.update(bodyProduct, { where: { id } });
    res.status(200).send({ message: "Edit product successfully!" });
  } catch (error) {
    console.log("error editProduct", error);
    res.status(500).send({ message: error });
  }
};

deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await db.product.destroy({ where: { id } });

    res.status(200).send({ message: "Delete product successfully!" });
  } catch (error) {
    console.log("error deleteProduct", error);
    res.status(500).send({ message: error });
  }
};

getProductByCode = async (req, res) => {
  try {
    const code = req.params.code.replace(/^\s+|\s+$/gm, "");
    let result = await db.product.findOne({
      where: { code, accountID: req.userID },
    });

    if (result) result.setDataValue("quantity", 1);
    else {
      res.status(404).send({ message: "Not found data!" });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.log("error getProductByCode", error);
    res.status(500).send({ message: error });
  }
};

getAllProduct = async (req, res) => {
  try {
    const result = await db.product.findAll({
      where: { accountID: req.userID },
      order: [["id", "DESC"]],
    });

    if (!result) {
      res.status(404).send({ message: "Not found data!" });
      return;
    }

    res.status(200).send(result);
  } catch (error) {
    console.log("error getAllProduct", error);
    res.status(500).send({ message: error });
  }
};

const product = {
  newProduct: newProduct,
  editProduct: editProduct,
  deleteProduct: deleteProduct,
  getProductByCode: getProductByCode,
  getAllProduct: getAllProduct,
};

module.exports = product;
