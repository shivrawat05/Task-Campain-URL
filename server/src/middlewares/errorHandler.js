import { ApiResponse } from "../utils/apiResponse.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || null;

  if (process.env.NODE_ENV !== "test") {
    if (statusCode >= 500) {
      console.error(" server error:", err);
    } else {
      console.warn(` client errr ${statusCode}]:`, err.message);
    }
  }

  return ApiResponse.error(res, message, statusCode, errors);
}

export function notFoundHandler(req, res, next) {
  return ApiResponse.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
  );
}
