import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = join(__dirname, "..", "data");
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const db = new Database(join(DB_DIR, "toeic.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    device_id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    test_set_id TEXT NOT NULL,
    test_set_title TEXT NOT NULL,
    data TEXT NOT NULL,
    scaled_score INTEGER NOT NULL,
    finished_at TEXT NOT NULL,
    FOREIGN KEY (device_id) REFERENCES users(device_id)
  );
  CREATE TABLE IF NOT EXISTS vocab_progress (
    device_id TEXT NOT NULL,
    card_id TEXT NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    last_reviewed_at TEXT NOT NULL,
    mastery_level TEXT NOT NULL DEFAULT 'new',
    PRIMARY KEY (device_id, card_id),
    FOREIGN KEY (device_id) REFERENCES users(device_id)
  );
  CREATE INDEX IF NOT EXISTS idx_test_device ON test_results(device_id);
`);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

function ensureUser(deviceId: string) {
  db.prepare("INSERT OR IGNORE INTO users (device_id) VALUES (?)").run(deviceId);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "toeic-api" });
});

app.post("/api/users/register", (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) return res.status(400).json({ error: "deviceId required" });
  ensureUser(deviceId);
  res.json({ ok: true, deviceId });
});

app.get("/api/progress/:deviceId/test-history", (req, res) => {
  const { deviceId } = req.params;
  ensureUser(deviceId);
  const rows = db
    .prepare(
      "SELECT data FROM test_results WHERE device_id = ? ORDER BY finished_at DESC",
    )
    .all(deviceId) as { data: string }[];
  res.json(rows.map((r) => JSON.parse(r.data)));
});

app.post("/api/progress/:deviceId/test-history", (req, res) => {
  const { deviceId } = req.params;
  const result = req.body;
  if (!result?.id) return res.status(400).json({ error: "Invalid result" });
  ensureUser(deviceId);
  db.prepare(
    `INSERT OR REPLACE INTO test_results (id, device_id, test_set_id, test_set_title, data, scaled_score, finished_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    result.id,
    deviceId,
    result.testSetId,
    result.testSetTitle,
    JSON.stringify(result),
    result.scaledScore,
    result.finishedAt,
  );
  res.json({ ok: true });
});

app.get("/api/progress/:deviceId/vocab", (req, res) => {
  const { deviceId } = req.params;
  ensureUser(deviceId);
  const rows = db
    .prepare("SELECT card_id, review_count, last_reviewed_at, mastery_level FROM vocab_progress WHERE device_id = ?")
    .all(deviceId) as { card_id: string; review_count: number; last_reviewed_at: string; mastery_level: string }[];
  const progress: Record<string, unknown> = {};
  for (const r of rows) {
    progress[r.card_id] = {
      cardId: r.card_id,
      reviewCount: r.review_count,
      lastReviewedAt: r.last_reviewed_at,
      masteryLevel: r.mastery_level,
    };
  }
  res.json(progress);
});

app.put("/api/progress/:deviceId/vocab/:cardId", (req, res) => {
  const { deviceId, cardId } = req.params;
  const { masteryLevel, reviewCount, lastReviewedAt } = req.body;
  ensureUser(deviceId);
  db.prepare(
    `INSERT OR REPLACE INTO vocab_progress (device_id, card_id, review_count, last_reviewed_at, mastery_level)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(deviceId, cardId, reviewCount ?? 1, lastReviewedAt ?? new Date().toISOString(), masteryLevel ?? "reviewing");
  res.json({ ok: true });
});

app.post("/api/sync/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const { testHistory = [], vocabProgress = {} } = req.body;
  ensureUser(deviceId);

  const insertTest = db.prepare(
    `INSERT OR IGNORE INTO test_results (id, device_id, test_set_id, test_set_title, data, scaled_score, finished_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertVocab = db.prepare(
    `INSERT OR REPLACE INTO vocab_progress (device_id, card_id, review_count, last_reviewed_at, mastery_level)
     VALUES (?, ?, ?, ?, ?)`,
  );

  const tx = db.transaction(() => {
    for (const r of testHistory) {
      insertTest.run(r.id, deviceId, r.testSetId, r.testSetTitle, JSON.stringify(r), r.scaledScore, r.finishedAt);
    }
    for (const [cardId, p] of Object.entries(vocabProgress as Record<string, { reviewCount: number; lastReviewedAt: string; masteryLevel: string }>)) {
      insertVocab.run(deviceId, cardId, p.reviewCount, p.lastReviewedAt, p.masteryLevel);
    }
  });
  tx();

  const history = db.prepare("SELECT data FROM test_results WHERE device_id = ? ORDER BY finished_at DESC").all(deviceId) as { data: string }[];
  const vocabRows = db.prepare("SELECT card_id, review_count, last_reviewed_at, mastery_level FROM vocab_progress WHERE device_id = ?").all(deviceId) as { card_id: string; review_count: number; last_reviewed_at: string; mastery_level: string }[];
  const vocab: Record<string, unknown> = {};
  for (const r of vocabRows) {
    vocab[r.card_id] = { cardId: r.card_id, reviewCount: r.review_count, lastReviewedAt: r.last_reviewed_at, masteryLevel: r.mastery_level };
  }

  res.json({
    testHistory: history.map((r) => JSON.parse(r.data)),
    vocabProgress: vocab,
  });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`TOEIC API running on http://localhost:${PORT}`);
});
