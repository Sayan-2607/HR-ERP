const errorHandler = (err, req, res, _next) => {
  console.error("Error:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Record already exists" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
