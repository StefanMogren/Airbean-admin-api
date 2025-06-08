import Menu from "../models/menu.model.js";

export async function validateOrder(req, res, next) {
	const { items, cartId } = req.body;

	// Checking for either userId or guestId
	if (!cartId) {
		return res.status(400).json({
			success: false,
			message: "Missing cartId",
		});
	}

	// Get menu items from DB to validate prodIds
	const menu = await Menu.find();
	const validProdIds = menu.map((item) => item.prodId);

	next(); // Passed all the checks
}
