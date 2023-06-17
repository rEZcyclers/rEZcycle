const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api", (req, res) => {
  res.json(["printed paper", "writing paper", "newspaper"]);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
