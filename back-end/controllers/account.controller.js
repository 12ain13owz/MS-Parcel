const config = require("../config/auth.config");
const db = require("../models/_index");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

onRegister = async (req, res) => {
  try {
    const email = req.body.email.replace(/^\s+|\s+$/gm, "");
    const password = req.body.password.replace(/^\s+|\s+$/gm, "");
    const salt = 10;
    const hash = bcrypt.hashSync(password, salt);
    await db.account.create({ email, password: hash });

    res.status(200).send({ message: "Registered successfully!" });
  } catch (error) {
    console.log("error onRegister", error);
    res.status(500).send({ message: error });
  }
};

onLogin = async (req, res) => {
  try {
    const email = req.body.email.replace(/^\s+|\s+$/gm, "");
    const password = req.body.password.replace(/^\s+|\s+$/gm, "");
    const remember = req.body.remember;
    const account = await db.account.findOne({ where: { email } });
    if (!account) {
      return res.status(404).send({ message: "User not found." });
    }

    let passwordIsValid = bcrypt.compareSync(password, account.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    let expires = 86400; // 24 Hour
    if (remember) expires = 60 * 60 * 24 * 30;

    let token = jwt.sign({ id: account.id }, config.secret, {
      expiresIn: expires,
    });

    res.status(200).send({
      email: account.email,
      accessToken: token,
    });
  } catch (error) {
    console.log("error onLogin", error);
    res.status(500).send({ message: error });
  }
};

const account = {
  onRegister: onRegister,
  onLogin: onLogin,
};

module.exports = account;
