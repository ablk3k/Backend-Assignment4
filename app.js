const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Serve frontend files from /public
app.use(express.static("public"));

// Routes
const menuRoutes = require("./routes/menu");
const reservationRoutes = require("./routes/reservations");
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);

// ✅ Root should return index.html automatically now,
// so REMOVE this JSON root route (or change it to /api)
/// app.get("/", (req, res) => res.json({ ok: true, message: "KaRima API" }));

// If you still want an API health check, do:
app.get("/api", (req, res) => res.json({ ok: true, message: "KaRima API" }));

// Error handler (must be last)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
