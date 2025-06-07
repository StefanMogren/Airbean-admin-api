import CustomError from "../utils/customError.util.js";

export const validateBody = (req, res, next) => {
	if (!req.body || Object.keys(req.body).length === 0) {
		throw new CustomError("Missing request body", 400);
	}
	next();
};
