module.exports = {
  database: process.env.DB_NAME || "msbsru_parcel",
  user: process.env.DB_User || "root",
  password: process.env.DB_Pass || "admin",
  option: {
    dialect: process.env.DIALECT || "sqlite",
    storage: "./msbsru_parcel.sqlite",
  },
};
