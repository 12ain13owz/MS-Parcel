const config = require("../config/db.config");
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

const sequelize = new Sequelize.Sequelize(
  config.database,
  config.user,
  config.password,
  config.option
);

module.exports = {
  Sequelize,
  sequelize,
  DataTypes,
};
