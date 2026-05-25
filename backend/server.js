require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ───
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: { error: "Too many requests" } });
app.use("/api/", limiter);

// ─── API Routes ───
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/employees", require("./src/routes/employees"));
app.use("/api/attendance", require("./src/routes/attendance"));
app.use("/api/leaves", require("./src/routes/leaves"));
app.use("/api/payroll", require("./src/routes/payroll"));
app.use("/api/recruitment", require("./src/routes/recruitment"));
app.use("/api/performance", require("./src/routes/performance"));
app.use("/api/learning", require("./src/routes/learning"));
app.use("/api/engagement", require("./src/routes/engagement"));
app.use("/api/helpdesk", require("./src/routes/helpdesk"));
app.use("/api/analytics", require("./src/routes/analytics"));
app.use("/api/ai", require("./src/routes/ai"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date(), version: "1.0.0", uptime: process.uptime() });
});

// ─── Error Handling ───
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 WorkSphere AI Backend Server       ║
  ║   Running on http://localhost:${PORT}       ║
  ║   Environment: ${process.env.NODE_ENV || "development"}           ║
  ╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
