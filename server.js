const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());
app.use("/api/v1/users", require("./api/v1/users")); // use the route, require the file
app.use("/api/v1/memory-cards", require("./api/v1/memory-cards"));
app.get("/", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3333;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
