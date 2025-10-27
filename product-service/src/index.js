import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/database.js";
import productsRoutes from "./routes/products.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productsRoutes);

const port = process.env.PORT || 3001;
connectMongo(process.env.MONGODB_URI).then(() => {
  app.listen(port, () => console.log(`🍎 product-service rodando na porta ${port}`));
});
