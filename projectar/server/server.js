const express = require("express");
// let multer = require("multer");
let bodyParser = require("body-parser");
let fs = require("fs");
let path = require("path");
// let crypto = require("crypto");
var cors = require("cors");
// const fileParser = require("express-multipart-file-parser");
const multiparty = require("connect-multiparty");

const MultipartyMiddleWare = multiparty({ uploadDir: "./images" });

// let storage = multer.diskStorage({
//   destination: "./public/upload",
//   filename: function(req, file, cb) {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       if (err) return cb(err);
//       cb(
//         null,
//         Math.floor(Math.random() * 9000000000) + 1000000000 + path.extname
//       );
//     });
//   },
// });

// let upload = multer({ dest: "/uploads" });

const app = express();

const PORT = process.env.PORT || 3001;

// app.use(fileParser);

app.use(cors({ credentials: false }));

app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  let title = "Plugin ImageBrowser";
  res.render("index", { result: "result" });
});

// app.get("/files", function(req, res) {
//   const images = fs.readdirSync("public/upload");
//   let sorted = [];
//   for (let item of images) {
//     if (
//       item.split(".").pop() === "png" ||
//       item.split(".").pop() === "jpg" ||
//       item.split(".").pop() === "jpeg" ||
//       item.split(".").pop() === "svg"
//     ) {
//       let abc = {
//         image: "/upload" + item,
//         folder: "/",
//       };
//       sorted.push(abc);
//     }
//   }
//   res.send(sorted);
// });

app.post("/upload", MultipartyMiddleWare, (req, res) => {
  console.log(req.files);
  const tempFile = req.files.upload;
  const tempFilePath = tempFile.path;
  const targetPath = path.join(__dirname, "./uploads/" + tempFile.name);

  if (
    path.extname(tempFile.originalFilename).toLowerCase() === ".png" ||
    ".jpg"
  ) {
    fs.rename(tempFilePath, targetPath, (err) => {
      res.status(200).json({
        uploaded: true,
        url: `http://localhost:3001/${tempFile.originalFilename}`,
      });

      if (err) return console.log(err);
    });
  }
});

app.post("/delete_file", function(req, res, next) {
  let url_del = "public" + req.body.url_del;
  console.log(url_del);
  if (fs.existsSync(url_del)) {
    fs.unlinkSync(url_del);
  }
  res.redirect("back");
});

app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});
