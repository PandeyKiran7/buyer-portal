import { Router } from "express";
import bcrypt from "bcryptjs";
import { qGet, qRun } from "../db.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { validateLogin, validateRegister } from "../validation.js";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const result = validateRegister(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: "Validation failed.", details: result.errors });
  }

  const { email, password, name } = result.value;

  const existing = qGet("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const info = qRun(
    `INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'buyer')`,
    [email, passwordHash, name]
  );

  const user = {
    id: Number(info.lastInsertRowid),
    email,
    name,
    role: "buyer",
  };

  const token = signToken(user);
  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

authRouter.post("/login", (req, res) => {
  const result = validateLogin(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: "Validation failed.", details: result.errors });
  }

  const { email, password } = result.value;
  const row = qGet(
    "SELECT id, email, password_hash, name, role FROM users WHERE email = ?",
    [email]
  );

  if (!row || !bcrypt.compareSync(password, String(row.password_hash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = {
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role),
  };
  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const row = qGet("SELECT id, email, name, role FROM users WHERE id = ?", [req.user.id]);

  if (!row) {
    return res.status(401).json({ error: "User not found." });
  }

  res.json({
    user: {
      id: Number(row.id),
      email: String(row.email),
      name: String(row.name),
      role: String(row.role),
    },
  });
});
