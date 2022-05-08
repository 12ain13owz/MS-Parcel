const { sequelize, DataTypes } = require("./_sequelize");
const account = sequelize.define("account", {
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
});

module.exports = account;
