const { sequelize, DataTypes } = require("./_sequelize");
const stock = sequelize.define("stock", {
  quantity: { type: DataTypes.INTEGER },
  detail: { type: DataTypes.STRING },
  addStock: { type: DataTypes.BOOLEAN },
  accountID: { type: DataTypes.INTEGER, allowNull: false },
  productID: { type: DataTypes.INTEGER, allowNull: false },
  code: { type: DataTypes.STRING(10), allowNull: false },
});

module.exports = stock;
