const authJwt = require("./auth.middleware");
const verify = require("./verify.middleware");

module.exports = {
  authJwt,
  verify,
};
