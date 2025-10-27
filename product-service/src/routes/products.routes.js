import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// Health check
router.get("/health", (req, res) => res.json({ status: "ok" }));

// Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const items = await Product.find();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Criar produto
router.post("/", async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Buscar produto por ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.sendStatus(404);
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Atualizar produto
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Deletar produto
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
