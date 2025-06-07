import MenuItem from "../models/menu.model.js";

import CustomError from "../utils/customError.util.js";

// GET /api/menu
export const getAllMenuItems = async (req, res, next) => {
	try {
		const menuItems = await MenuItem.find();
		res.status(200).json(menuItems);
	} catch (err) {
		next(new CustomError("Failed to get menu items", 500, err));
	}
};

// POST /api/menu/seed
export const seedMenu = async (req, res, next) => {
	try {
		const mockItems = [
			{
				prodId: "prod-jespe",
				title: "Bryggkaffe",
				desc: "Bryggd på månadens bönor.",
				price: 39,
			},
			{
				prodId: "prod-rnybe",
				title: "Caffè Doppio",
				desc: "Bryggd på månadens bönor.",
				price: 49,
			},
			{
				prodId: "prod-rgist",
				title: "Cappuccino",
				desc: "Bryggd på månadens bönor.",
				price: 49,
			},
			{
				prodId: "prod-hebes",
				title: "Latte Macchiato",
				desc: "Bryggd på månadens bönor.",
				price: 49,
			},
			{
				prodId: "prod-tofth",
				title: "Kaffe Latte",
				desc: "Bryggd på månadens bönor.",
				price: 54,
			},
			{
				prodId: "prod-ebest",
				title: "Cortado",
				desc: "Bryggd på månadens bönor.",
				price: 39,
			},
		];

		await MenuItem.deleteMany();
		const inserted = await MenuItem.insertMany(mockItems);
		res.status(201).json(inserted);
	} catch (err) {
		next(new CustomError("Failed to seed menu items", 500, err));
	}
};

// POST /api/menu  // Adding a new item/items
export const addMenuItem = async (req, res, next) => {
	const { prodId, title, desc, price } = req.body;

	if (!prodId || !title || !desc || typeof price !== "number") {
		throw new CustomError("Invalid menu item data", 400);
	}

	try {
		const newItem = await MenuItem.create(req.body);
		res.status(201).json(newItem);
	} catch (err) {
		next(new CustomError("Failed to add menu item", 400, err));
	}
};
