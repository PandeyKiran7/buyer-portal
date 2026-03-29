import { Router } from "express";
import { qAll, qGet } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const propertiesRouter = Router();

function publicPropertyShape(row) {
  const id = Number(row.id);
  return {
    id,
    title: String(row.title),
    address: String(row.address),
    pricePerNight: 89 + (id * 23) % 210,
    rating: Number((4.2 + (id % 8) * 0.09).toFixed(2)),
    reviewCount: 18 + (id * 7) % 220,
  };
}

propertiesRouter.get("/public", (_req, res) => {
  const rows = qAll("SELECT id, title, address FROM properties ORDER BY id", []);
  res.json({
    properties: rows.map((p) => publicPropertyShape(p)),
  });
});

propertiesRouter.get("/public/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid property id." });
  }
  const row = qGet("SELECT id, title, address FROM properties WHERE id = ?", [id]);
  if (!row) {
    return res.status(404).json({ error: "Property not found." });
  }
  res.json({ property: publicPropertyShape(row) });
});

propertiesRouter.use(requireAuth);

propertiesRouter.get("/", (req, res) => {
  const rows = qAll("SELECT id, title, address FROM properties ORDER BY id", []);
  const favRows = qAll("SELECT property_id FROM favourites WHERE user_id = ?", [req.user.id]);
  const favSet = new Set(favRows.map((r) => Number(r.property_id)));

  res.json({
    properties: rows.map((p) => ({
      id: Number(p.id),
      title: String(p.title),
      address: String(p.address),
      isFavourite: favSet.has(Number(p.id)),
    })),
  });
});
