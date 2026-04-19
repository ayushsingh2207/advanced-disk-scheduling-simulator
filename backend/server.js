const express = require("express");
const cors = require("cors");
const schedulingRoutes = require("./routes/scheduling");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());                  // Allow frontend to call this API
app.use(express.json());          // Parse JSON request bodies

// ── Routes ─────────────────────────────────────────────
app.use("/api", schedulingRoutes);

// ── Health check ───────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "Disk Scheduling Simulator API is running 🚀" });
});

// ── Start server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🖥️  Server running at http://localhost:${PORT}\n`);
});
