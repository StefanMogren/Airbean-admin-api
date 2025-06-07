class CustomError extends Error {
	constructor(message, statusCode = 500, errors = null) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
	}
}

export default CustomError;
