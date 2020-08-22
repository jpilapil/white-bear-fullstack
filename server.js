const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use("/api/v1/users", require("./api/v1/users")); // use the route, require the file
app.use("/api/v1/memory-cards", require("./api/v1/memory-cards"));

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html")); // ./client/build/index.html
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log("App is running on port " + port);
});
