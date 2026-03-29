import "dotenv/config";
import cors from "cors";
import express from "express";
import { initDb } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { favouritesRouter } from "./routes/favourites.js";
import { propertiesRouter } from "./routes/properties.js";

const app = express();
const port = Number(process.env.PORT) || 3001;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/properties", propertiesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

await initDb();

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Close the other process or set PORT in .env`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
