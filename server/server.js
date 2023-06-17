const express = require("express");
const cors = require("cors");
const { recyclableItems } = require("./recyclableItems");
const { donatableItems } = require("./donatableItems");
const { eWasteItems } = require("./eWasteItems");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json([{ testKey: "testVal" }]);
});

app.get("/recyclables", (req, res) => {
  res.json(recyclableItems);
});

app.get("/donatables", (req, res) => {
  res.json(donatableItems);
});

app.get("/eWaste", (req, res) => {
  res.json(eWasteItems);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
