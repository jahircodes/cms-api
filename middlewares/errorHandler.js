// Centralized error handling middleware
module.exports = (err, req, res, next) => {
  // Default to 500 if status not set
  const status = err.status || 500;
  // Use provided message or generic fallback
  const message = err.message || "An unexpected error occurred";
  res.status(status).json({
    success: false,
    message,
  });
};
