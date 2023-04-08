const express = require("express");
const image = require("./models/magemodel");
const app = express();
const path = require("path");
require("./Connect_DB/connect");
const fs = require("fs");
const multer = require("multer");

app.use(express.json());

const storage = multer.diskStorage({
  // distinatio (creation destinition de notre file selon son extension )
  destination: function (req, file, cb) {
    const ext_withstartpoint = path.extname(file.originalname);
    const extension = ext_withstartpoint.slice(1);
    const folderpath = `Uploads/${extension}`;

    fs.mkdirSync(folderpath, { recursive: true });
    cb(null, folderpath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  image_type = ["gif", "jpeg", "png", "jpg"];
  const extension = path.extname(file.originalname).slice(1);

  const found = image_type.find((element) => element == extension);

  if (found == undefined) {
    const error = new Error("Wrong file type");
    console.log("Wrong file type");

    return cb(error, false);
  } else {
    return cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post("/upload", upload.array("image"), async (req, res) => {
  try {
    const path = req.file.path;
    const Product = new image({
      name: req.body.name,
      discription: req.body.discription,
      image: path,
    });
    await Product.save();
    res.send({ message: "Product uploaded successfully!" });
    console.log(`type de file est   ${req.file}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("app serving on port " + 3000);
});
