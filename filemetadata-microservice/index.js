var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");

var app = express();

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  try {
    //https://www.npmjs.com/package/multer
    //console.log(req.file, req.body)
    const { originalname, mimetype, size } = req.file;

    const fileMetadata = {
      name: originalname,
      type: mimetype,
      size: size,
    };

    res.json(fileMetadata);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the file" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
