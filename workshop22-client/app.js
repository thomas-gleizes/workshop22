import { Socket } from "node:net";
import fs from "node:fs/promises";

import express from "express";
import cors from "cors";
import lockfile from "proper-lockfile";

const socket = new Socket();
const [, , port, country] = process.argv;

socket.connect(8080, "localhost", async () => {
  socket.write(country);

  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "5mb" }));

  fs.access("data.json", fs.constants.F_OK).catch(() =>
    fs.writeFile("data.json", JSON.stringify({ [country]: [] }))
  );

  app.get("/", async (req, res) => {
    const data = await fs.readFile("data.json").then(JSON.parse);

    if (!data.hasOwnProperty(country)) {
      data[country] = [];

      await fs.writeFile("data.json", JSON.stringify(data));
    }

    res.send({ success: true, transactions: data[country], country });
  });

  app.post("/buy", (req, res) => {
    socket.write(`achat:${req.body.amount}`);

    res.send({ success: true });
  });

  app.post("/sell", (req, res) => {
    socket.write(`vente:${req.body.amount}`);

    res.send({ success: true });
  });

  app.listen(port);

  socket.on("data", async (data) => {
    let isFinish = false;

    while (!isFinish) {
      try {
        const json = await fs.readFile("data.json").then(JSON.parse);
        await lockfile.lock("data.json", { retries: 0 });

        json[country].push(data.toString());

        await fs.writeFile("data.json", JSON.stringify(json));

        await lockfile.unlock("data.json");

        isFinish = true;
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  });

  socket.on("end", () => {
    console.log("disconnected from server");

    process.exit(0);
  });
});
