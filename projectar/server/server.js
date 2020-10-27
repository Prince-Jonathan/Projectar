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

const app = express();

app.use(cors({ credentials: false }));
app.use(express.static(path.join("..", "build")));
app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 9000;

app.get("/*", function(req, res) {
  cl;
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
// app.listen(PORT)

// app.get("/", function(req, res) {
//   let title = "Plugin ImageBrowser";
//   res.render("index", { result: "result" });
// });

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
        // url: `https://a1f4767f01bb.ngrok.io/${tempFile.originalFilename}`,
        url: `/${tempFile.originalFilename}`,
        // url: `./${tempFile.originalFilename}`,
      });
    });
  }
});

app.post("/delete_file", function(req, res, next) {
  let url_del = "public" + req.body.url_del;
  if (fs.existsSync(url_del)) {
    fs.unlinkSync(url_del);
  }
  res.redirect("back");
});

app.listen(PORT, function() {});
