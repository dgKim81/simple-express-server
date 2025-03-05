import "express-async-errors";

import Express, { ErrorRequestHandler } from "express";
import fs from "fs/promises";
import path from "path";
import bodyParser, { json } from "body-parser";

const app = Express();
app.use(bodyParser.json());
const filePath = path.join("data", "data.json");

async function checkFile(): Promise<void> {
  let exists = true;
  try {
    await fs.access(filePath);
  } catch {
    exists = false;
  }

  if (!exists) {
    try {
      await fs.access(path.join("data"));
    } catch {
      fs.mkdir(path.join("data"));
    }

    fs.writeFile(filePath, "[]");
  }
}

checkFile();

app.get("/tasks/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const jsonFile = await fs.readFile(filePath);
  const jsons = JSON.parse(jsonFile.toString("utf-8")) as { id: number, title: string, description: string }[];
  const resultIndex = jsons.findIndex(itm => itm.id === id);

  if (resultIndex >= 0) {
    res.status(200)
      .send(jsons[resultIndex]);
  } else {
    res.status(404);
  }
});

app.get("/tasks/", async (req, res) => {
  const jsonFile = await fs.readFile(filePath);
  const jsons = JSON.parse(jsonFile.toString("utf-8")) as { id: number, title: string, description: string }[];
  res.status(200).send(jsons);
});

app.post("/tasks/", async (req, res) => {
  const jsonFile = await fs.readFile(filePath);
  const jsons = JSON.parse(jsonFile.toString("utf-8")) as { id: number, title: string, description: string }[];
  const body = req.body as { title: string, description: string };

  const saveItem = {
    id: jsons.length + 1,
    ...body
  };

  jsons.push(saveItem);

  fs.writeFile(filePath, JSON.stringify(jsons));

  res.send(saveItem);
});

app.delete("/tasks/:id(\d+)", async (req, res) => {
  const id = parseInt(req.params.id);
  const jsonFile = await fs.readFile(filePath);
  const jsons = JSON.parse(jsonFile.toString("utf-8")) as { id: number, title: string, description: string }[];
  const removedItemJsons = jsons.filter(itm => itm.id !== id);
  
  fs.writeFile(filePath, JSON.stringify(removedItemJsons));
  res.send("delete data");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    "errorMessage" : "오류가 발생하였습니다."
  });
};

app.use(errorHandler);
app.listen(3000, () =>{
  console.log(`listening on port ${3000}`);
});

