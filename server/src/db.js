import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.SQLITE_PATH || path.join(__dirname, "..", "data", "app.db");

let db;

function persist() {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

/** @param {string} sql @param {import("sql.js").SqlValue[]} [params] */
export function qRun(sql, params = []) {
  db.run(sql, params);
  const changes = db.getRowsModified();
  const idRow = qGet("SELECT last_insert_rowid() AS id", []);
  persist();
  return {
    changes,
    lastInsertRowid: idRow ? Number(idRow.id) : 0,
  };
}

/** @param {string} sql @param {import("sql.js").SqlValue[]} [params] */
export function qGet(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

/** @param {string} sql @param {import("sql.js").SqlValue[]} [params] */
export function qAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    db = new SQL.Database();
  }

  db.run("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'buyer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      address TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favourites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      property_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, property_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_favourites_user ON favourites(user_id);
  `);
  persist();

  const countRow = qGet("SELECT COUNT(*) AS c FROM properties");
  const c = countRow ? Number(countRow.c) : 0;
  if (c === 0) {
    const seed = [
      { title: "Riverside Loft", address: "12 Wharf St, Melbourne" },
      { title: "Garden Terrace", address: "88 Elm Rd, Sydney" },
      { title: "City View Apartment", address: "400 Queen St, Brisbane" },
      { title: "Coastal Cottage", address: "3 Ocean Ave, Perth" },
    ];
    db.run("BEGIN");
    try {
      for (const row of seed) {
        db.run("INSERT INTO properties (title, address) VALUES (?, ?)", [row.title, row.address]);
      }
      db.run("COMMIT");
      persist();
    } catch (e) {
      db.run("ROLLBACK");
      throw e;
    }
  }
}
