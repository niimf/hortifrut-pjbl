import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Login simples (para demonstração)
router.post("/login", (req, res) => {
  const { username = "demo" } = req.body || {};
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  res.json({ token, message: "Login successful" });
});

export default router;
