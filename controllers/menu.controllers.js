import Menu from "../models/menu.model.js";

import CustomError from "../utils/customError.util.js";
import { generateProdId } from "../utils/idGenerator.util.js";
import { verifyToken } from "../utils/verifier.util.js";
import { getUserByUserId } from "./auth.controllers.js";

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
	try {
		const { title, desc, price } = req.body;
		if (!title || !desc || !price) {
			return next(
				new CustomError(
					"Both title, desc, and price are required.",
					400
				)
			);
		}
		const updatedMenu = await Menu.create({
			prodId: generateProdId(),
			title,
			desc,
			price,
		});

		if (updatedMenu) {
			res.json({
				success: true,
				message: "Successfully added new menu item",
			});
		} else {
			return next(new CustomError("Failed to add new menu item.", 400));
		}
	} catch (error) {
		next(error);
	}
};

// PUT /api/menu/{prodId}
export const updateMenuItem = async (req, res, next) => {
	try {
		const { prodId } = req.params;

		const menuItem = await Menu.findOne({ prodId });

		// Kontroll ifall menuItem finns eller ej
		if (!menuItem) {
			return next(new CustomError("No item with prodId found.", 400));
		}

		const { title, desc, price } = req.body;
		if (!title || !desc || !price) {
			return next(
				new CustomError(
					"Both title, desc, and price are required.",
					400
				)
			);
		}

		menuItem.title = title;
		menuItem.desc = desc;
		menuItem.price = price;

		await menuItem.save();

		res.json({
			success: true,
			message: "Successfully edited item",
		});
	} catch (error) {
		next(error);
	}
};

// DELETE /api/menu/{prodId}
export const deleteMenuItem = async (req, res, next) => {
	try {
	} catch (error) {}
};
