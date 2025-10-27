import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/api.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.get("/health", (_, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🔐 bff-service rodando na porta ${port}`));
