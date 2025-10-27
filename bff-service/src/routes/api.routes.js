import { Router } from "express";
import axios from "axios";
import { auth } from "../middleware/auth.js";

const router = Router();

const PROD = () => process.env.PRODUCT_SERVICE_URL;
const ORD = () => process.env.ORDER_SERVICE_URL;
const FN = () => process.env.FUNCTION_BASE_URL;

// ========== PROXY PRODUCTS ==========

router.get("/products", auth, async (req, res) => {
  try {
    const r = await axios.get(`${PROD()}/products`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/products", auth, async (req, res) => {
  try {
    const r = await axios.post(`${PROD()}/products`, req.body);
    res.status(201).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/products/:id", auth, async (req, res) => {
  try {
    const r = await axios.get(`${PROD()}/products/${req.params.id}`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/products/:id", auth, async (req, res) => {
  try {
    const r = await axios.put(`${PROD()}/products/${req.params.id}`, req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/products/:id", auth, async (req, res) => {
  try {
    await axios.delete(`${PROD()}/products/${req.params.id}`);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ========== PROXY ORDERS ==========

router.get("/orders", auth, async (req, res) => {
  try {
    const r = await axios.get(`${ORD()}/orders`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/orders", auth, async (req, res) => {
  try {
    const r = await axios.post(`${ORD()}/orders`, req.body);
    res.status(201).json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/orders/:id", auth, async (req, res) => {
  try {
    const r = await axios.get(`${ORD()}/orders/${req.params.id}`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/orders/:id", auth, async (req, res) => {
  try {
    const r = await axios.put(`${ORD()}/orders/${req.params.id}`, req.body);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/orders/:id", auth, async (req, res) => {
  try {
    await axios.delete(`${ORD()}/orders/${req.params.id}`);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ========== CREATE VIA EVENTO (Function) ==========

router.post("/orders/event", auth, async (req, res) => {
  try {
    const r = await axios.post(`${FN()}/api/event-processor`, req.body);
    res.status(r.status).json(r.data);
  } catch (e) {
    res.status(500).json({ error: "Function not available or " + e.message });
  }
});

// ========== AGREGAÇÃO (Dashboard) ==========

router.get("/dashboard", auth, async (req, res) => {
  try {
    const [products, orders, functionPing] = await Promise.all([
      axios.get(`${PROD()}/products`),
      axios.get(`${ORD()}/orders`),
      axios.get(`${FN()}/api/notification-service?ping=true`).catch(() => ({ data: { status: "unavailable" } }))
    ]);
    
    res.json({
      products: products.data,
      orders: orders.data,
      functionStatus: functionPing.data
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
