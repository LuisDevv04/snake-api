import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const port = process.env.PORT || 3000;

app.use(cors());

const snakes = JSON.parse(
  fs.readFileSync(path.join(_dirname, "snakes.json"), "utf-8")
);

app.get("/api/snakes", (req, res) => {
  let results = snakes;

  if (req.query.name) {
    const queryName = req.query.name.toLowerCase();
    results = results.filter((snake) =>
      snake.name.toLowerCase().includes(queryName)
    );
  }

  if (req.query.scientific) {
    const querySci = req.query.scientific.toLowerCase();
    results = results.filter((snake) =>
      snake.scientificName.toLowerCase().includes(querySci)
    );
  }

  if (req.query.venomous) {
    const isVenomous = req.query.venomous.toLowerCase() === "true";
    results = results.filter((snake) => snake.venomous === isVenomous);
  }

  res.json(results);
});

app.get("/api/snakes/:id", (req, res) => {
  const snake = snakes.find((s) => s.id === parseInt(req.params.id));
  if (!snake) {
    return res.status(404).json({ error: "Snake not found" });
  }
  res.json(snake);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
