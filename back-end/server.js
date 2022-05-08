const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

const db = require("./models/_index");
const routesUser = require("./routes/user.routes");
const app = express();
const port = process.env.PORT || 3000;
const public = path.join(__dirname, "public");

// const whitelist = [
//   "http://localhost:4200",
//   "https://bsru-parcel.web.app/",
//   "https://bsru-parcel-demo.herokuapp.com/",
// ];
// let corOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// const corOptions = {
//   origin: "https://bsru-parcel.web.app/",
// };

//app.use(cors(corOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

db.sequelize.sync();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(public));
app.use("/api/user", routesUser);

app.get("", (req, res) => {
  res.status(200).send({ message: "Server is running." });
});

const server = app.listen(port, () => {
  console.log(`CORS-enabled web server listening on port ${port}.`);
});

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
  process.on(sig, () => {
    server.close();
    process.exit();
  });
});
