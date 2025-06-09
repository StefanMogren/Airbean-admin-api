import { verifyToken } from "../utils/verifier.util.js";
import CustomError from "../utils/customError.util.js";
import { getUserByUserId } from "../controllers/auth.controllers.js";

export const verifyAdmin = async (req, res, next) => {
	const authorization = req.headers.authorization;

	if (!authorization) {
		throw new CustomError("No token provided", 400);
	}

	const token = authorization.replace("Bearer ", "");

	const decodedToken = verifyToken(token);
	if (!decodedToken) {
		throw new CustomError("Invalid or expired token", 400);
	}

	const user = await getUserByUserId(decodedToken.userId);
	if (user.role !== "admin") {
		throw new CustomError("Action not allowed as user or guest.", 403);
	}
	next();
};
