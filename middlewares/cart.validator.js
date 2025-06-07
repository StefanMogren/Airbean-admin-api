export function validateCartUpdate(req, res, next) {
    const { prodId, qty, guestId } = req.body;
    const userId = global.user ? global.user.userId : null;

    // Checking for items in menu with prodID
    if (!prodId || typeof prodId !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing 'prodId'.",
        });
    }

    // Checking for quantity
    if (typeof qty !== "number") {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a number.",
        });
    }

    if (qty < 0) {
        return res.status(400).json({
            success: false,
            message: "Can't add negative quantity.",
        });
    }

    // Checking for either userId  or guestId
    if (!userId && !guestId) {
        return res.status(400).json({
            success: false,
            message: "Missing guestId or not logged in",
        });
    }
    next(); // Passed all the checks
}
