import Menu from "../models/menu.model.js";

import CustomError from "../utils/customError.util.js";
import { verifyToken } from "../utils/verifier.util.js";

// GET /api/menu
export const getAllMenuItems = async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json(menu);
	} catch (err) {
		next(new CustomError("Failed to get menu items", 500, err));
	}
};

// POST /api/menu
export const addNewMenuItem = async (req, res, next) => {
	/* 	const token = req.headers.authorization.replace("Bearer ", "");
	console.log(token); */
	const token = req.cookies.userToken;
	const decodedToken = verifyToken(token);

	res.json({
		success: true,
		message: "Successfully added new menu item",
	});
};

// PUT /api/menu/{prodId}
export const updateMenuItem = async (req, res, next) => {
	try {
	} catch (error) {}
};

// DELETE /api/menu/{prodId}
export const deleteMenuItem = async (req, res, next) => {
	try {
	} catch (error) {}
};
