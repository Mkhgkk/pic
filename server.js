const express = require("express");
const path = require("path");

const app = express();

// serving static asssets such as css and images
app.use(express.static("public"));
const port = process.env.PORT || 3000;

// handling routes like this
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/html/login.html"));
});

app.post("/login", function (req, res) {
  console.log("I got called: ", req.params);
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
