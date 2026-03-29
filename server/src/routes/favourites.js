import { Router } from "express";
import { qAll, qGet, qRun } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { parsePropertyId } from "../validation.js";

export const favouritesRouter = Router();

favouritesRouter.use(requireAuth);

favouritesRouter.get("/", (req, res) => {
  const rows = qAll(
    `SELECT p.id AS property_id, p.title, p.address, f.created_at
     FROM favourites f
     JOIN properties p ON p.id = f.property_id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [req.user.id]
  );

  res.json({
    favourites: rows.map((r) => ({
      propertyId: Number(r.property_id),
      title: String(r.title),
      address: String(r.address),
      favouritedAt: String(r.created_at),
    })),
  });
});

favouritesRouter.post("/", (req, res) => {
  const propertyId = parsePropertyId(req.body?.propertyId);
  if (propertyId === null) {
    return res.status(400).json({ error: "propertyId must be a positive integer." });
  }

  const property = qGet("SELECT id FROM properties WHERE id = ?", [propertyId]);
  if (!property) {
    return res.status(404).json({ error: "Property not found." });
  }

  try {
    qRun("INSERT INTO favourites (user_id, property_id) VALUES (?, ?)", [
      req.user.id,
      propertyId,
    ]);
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("UNIQUE") || msg.includes("constraint")) {
      return res.status(409).json({ error: "This property is already in your favourites." });
    }
    throw e;
  }

  res.status(201).json({ message: "Added to favourites." });
});

favouritesRouter.delete("/:propertyId", (req, res) => {
  const propertyId = parsePropertyId(req.params.propertyId);
  if (propertyId === null) {
    return res.status(400).json({ error: "Invalid property id." });
  }

  const info = qRun("DELETE FROM favourites WHERE user_id = ? AND property_id = ?", [
    req.user.id,
    propertyId,
  ]);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Favourite not found." });
  }

  res.json({ message: "Removed from favourites." });
});
