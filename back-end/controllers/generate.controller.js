const jsBarcode = require("jsbarcode");
const { jsPDF } = require("jspdf");
const { Canvas } = require("canvas");
const { Buffer } = require("buffer");
const db = require("../models/_index");

getBarCode = async (req, res) => {
  try {
    const date = getDate();
    const filename = `barcode-${date}.pdf`;
    const doc = new jsPDF("p", "mm", "a4");
    let pageNo = 1;
    let posX = 5;
    let posY = 5;
    let imgWidth = 50;
    let imgHeight = 30;
    let row = 7;
    let type = "png";

    for (const data of req.body) {
      let barcode = generateBarcode(data.code);
      let posY2 = 0;

      for (let i = 1; i <= row; i++) {
        if (i > 1) posY2 = posY2 + 40;

        doc.addImage(barcode, type, posX, posY + posY2, imgWidth, imgHeight);
        doc.addImage(
          barcode,
          type,
          posX + 75,
          posY + posY2,
          imgWidth,
          imgHeight
        );
        doc.addImage(
          barcode,
          type,
          posX + 150,
          posY + posY2,
          imgWidth,
          imgHeight
        );
      }

      if (pageNo < req.body.length) {
        pageNo++;
        doc.addPage();
        doc.setPage(pageNo);
      }
    }

    const filePdf = doc.output();
    const buffer = Buffer.from(filePdf, "binary");
    const b64Data = buffer.toString("base64");

    res
      .status(200)
      .send({ message: "success", b64Data: b64Data, filename: filename });
  } catch (error) {
    console.log("error getBarCode", error);
    res.status(500).send({ message: error });
  }
};

getAllStock = async (req, res) => {
  try {
    const result = await db.stock.findAll({
      where: { accountID: req.userID },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send(result);
  } catch (error) {
    console.log("error getAllStock", error);
    res.status(500).send({ message: error });
  }
};

const generate = {
  getBarCode: getBarCode,
};

module.exports = generate;

function generateBarcode(value) {
  const canvas = new Canvas(100, 100, "png");
  jsBarcode(canvas, value, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 50,
    displayValue: true,
  });
  return canvas.toBuffer();
}

function getDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return (date = `${dd}-${mm}-${yyyy}`);
}
