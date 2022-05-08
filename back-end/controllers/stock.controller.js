const db = require("../models/_index");

getAllStock = async (req, res) => {
  try {
    const result = await db.stock.findAll({
      where: { accountID: req.userID },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send(result);
  } catch (error) {
    console.log("error getAllStock", error);
    res.status(500).send({ message: error });
  }
};

cutProductStock = async (req, res) => {
  try {
    const bodyStock = {};
    let result = [];
    let stock = 0;

    for (const data of req.body) {
      stock = data.stock - data.quantity;

      if (stock < 0) {
        result.push(data);
        continue;
      }
      await db.product.update(
        { stock },
        { where: { id: data.id, accountID: data.accountID } }
      );

      bodyStock.quantity = data.quantity;
      bodyStock.detail = "";
      bodyStock.addStock = false;
      bodyStock.accountID = data.accountID;
      bodyStock.productID = data.id;
      bodyStock.code = data.code;

      await db.stock.create(bodyStock);
    }
    res.status(200).send(result);
  } catch (error) {
    console.log("error cutProductStock", error);
    res.status(500).send({ message: error });
  }
};

const stock = {
  getAllStock: getAllStock,
  cutProductStock: cutProductStock,
};

module.exports = stock;
