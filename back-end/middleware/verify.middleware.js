const db = require("../models/_index");

checkDuplicateEmail = async (req, res, next) => {
  try {
    let email = req.body.email.replace(/^\s+|\s+$/gm, "");
    const account = await db.account.findOne({ where: { email } });

    if (account) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }
    next();
  } catch (error) {
    console.log("error checkDuplicateEmail", error);
    res.status(500).send({ message: error });
  }
};

checkDuplicateProduct = async (req, res, next) => {
  try {
    let code = req.body.code.replace(/^\s+|\s+$/gm, "");
    const product = await db.product.findOne({
      where: { code, accountID: req.userID },
    });

    if (product) {
      return res.status(400).send({
        message: "Failed! Code is already in use!",
      });
    }

    next();
  } catch (error) {
    console.log("error checkDuplicateProduct", error);
    res.status(500).send({ message: error });
  }
};

const verify = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkDuplicateProduct: checkDuplicateProduct,
};

module.exports = verify;
