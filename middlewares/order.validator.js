import MenuItem from "../models/menu.model.js";

export async function validateOrder(req, res, next) {
	const { items, cartId } = req.body;
	const userId = global.user ? global.user.userId : null;

	// Checking for either userId or guestId
	if (!cartId) {
		return res.status(400).json({
			success: false,
			message: "Missing cartId",
		});
	}
	/* if (!userId && !guestId) {
        return res.status(400).json({
            success: false,
            message: "Missing guestId or not logged in",
        });
    } */

	/*    // Checking that items is a non-empty array
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Order must contain at least one item."
        });
    } */

	// Get menu items from DB to validate prodIds
	const menu = await MenuItem.find();
	const validProdIds = menu.map((item) => item.prodId);

	/*     for (let item of items) {
        // Checking for valid prodId
        if (!item.prodId || typeof item.prodId !== "string" || !validProdIds.includes(item.prodId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid or missing 'prodId': ${item.prodId}`
            });
        }

        // Checking for valid quantity
        if (typeof item.qty !== "number" || item.qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Minst 1 vara måste beställas"
            });
        }
    } */

	next(); // Passed all the checks
}
