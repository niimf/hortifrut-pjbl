import { Router } from "express";
import { getPool } from "../config/database.js";

const router = Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

// Listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Orders ORDER BY id DESC");
    res.json(result.recordset);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Criar pedido
router.post("/", async (req, res) => {
  try {
    const { customerName, total } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input("customerName", customerName)
      .input("total", total)
      .query("INSERT INTO Orders(customerName,total) OUTPUT inserted.* VALUES(@customerName,@total)");
    res.status(201).json(result.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Buscar pedido por ID
router.get("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", req.params.id)
      .query("SELECT * FROM Orders WHERE id=@id");
    const row = result.recordset[0];
    if (!row) return res.sendStatus(404);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Atualizar pedido
router.put("/:id", async (req, res) => {
  try {
    const { customerName, total, status } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input("id", req.params.id)
      .input("customerName", customerName)
      .input("total", total)
      .input("status", status || 'pending')
      .query("UPDATE Orders SET customerName=@customerName,total=@total,status=@status WHERE id=@id; SELECT * FROM Orders WHERE id=@id");
    const row = result.recordset[0];
    if (!row) return res.sendStatus(404);
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Deletar pedido
router.delete("/:id", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().input("id", req.params.id).query("DELETE FROM Orders WHERE id=@id");
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
