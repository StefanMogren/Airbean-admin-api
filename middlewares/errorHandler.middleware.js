const errorHandler = (err, req, res, next) => {
	console.error("Error caught by middleware:", err);

	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
		// stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
		// errors: err.errors || undefined,
	});
};

export default errorHandler;
