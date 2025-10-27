import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orders from "./routes/orders.routes.js";
import { getPool } from "./config/database.js";
import fs from "fs";
import path from "path";
import url from "url";

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use("/orders", orders);

const port = process.env.PORT || 3002;

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, "db/init.sql"), "utf-8");
  const pool = await getPool();
  await pool.request().query(sql);
  app.listen(port, () => console.log(`🛒 order-service rodando na porta ${port}`));
})().catch(console.error);
