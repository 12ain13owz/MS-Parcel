const { Sequelize, sequelize } = require("./_sequelize");
const account = require("./account.model");
const product = require("./product.model");
const stock = require("./stock.model");
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.account = account;
db.product = product;
db.stock = stock;

module.exports = db;
