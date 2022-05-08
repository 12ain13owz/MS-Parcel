const { sequelize, DataTypes } = require("./_sequelize");
const product = sequelize.define("product", {
  code: { type: DataTypes.STRING(10), allowNull: false },
  title: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER },
  specification: { type: DataTypes.STRING(1000) },
  accountID: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = product;
