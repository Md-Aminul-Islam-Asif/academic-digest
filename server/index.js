import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Neon DB connect
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
