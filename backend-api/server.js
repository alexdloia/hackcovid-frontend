const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = 8000;

app.use(cors());

app.get("/get_project", (req, res) => 
  res.sendFile(path.join(__dirname, "projects", req.query.id + ".json"))
);

app.get("/get_categories", (req, res) => 
  res.sendFile(path.join(__dirname, "categories.json"))
);

app.get("/get_category", (req, res) => 
  res.sendFile(path.join(__dirname, "categories", req.query.id + ".json"))
);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
