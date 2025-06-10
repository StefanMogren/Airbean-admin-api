import Order from "../models/order.models.js";
import Cart from "../models/cart.model.js";
import Menu from "../models/menu.model.js";
import { calculateCartTotal } from "../utils/discount.util.js";
import { verifyToken } from "../utils/verifier.util.js";

// ----- GET /api/orders -----
// Returnerar alla ordrar
export const getAllOrders = async (req, res) => {
	const orders = await Order.find();
	if (orders.length > 0) {
		return res.json({
			success: true,
			orders: orders,
		});
	} else {
		return res.status(404).json({
			success: false,
			message: "No orders found",
		});
	}
};

// ----- GET /api/orders/:userId -----
// Returnerar alla ordrar baserat på userId
export const getOrdersByUserId = async (req, res) => {
	// Kontroll ifall req.params ens finns
	if (req.params) {
		const { userId } = req.params;

		// Kontroll ifall userId är 10 tecken långt
		if (userId.length === 10) {
			const orders = await Order.find({ userId: userId });

			// Kontroll att det finns någon order i orders
			if (orders.length > 0) {
				return res.json({
					success: true,
					orders: orders,
				});
			} else {
				return res.status(204).json({
					success: true,
					message: "No orders found for userId",
				});
			}
		} else {
			return res.status(400).json({
				success: false,
				message: "Invalid userId provided",
			});
		}
	} else {
		return res.status(400).json({
			success: false,
			message: "No params provided.",
		});
	}
};
// ----- POST /api/orders -----
// Skapar en order baserat på cartId som skickas med i body
// Kollar ifall användaren är inloggad eller ej
export const createOrder = async (req, res) => {
	// Kontroll ifall någon body finns
	const { cartId } = req.body;

	const cart = await Cart.findOne({ cartId: cartId });

	// Kontroll att cart med cartId finns
	if (cart) {
		const { userId, guestId, items } = cart;
		// let total = 0;

		if (cart.items.length > 0) {
			// Kontroll att en användare är inloggad och att userId finns
			const token = req.headers.authorization.replace("Bearer ", "");
			// const token = req.cookies.userToken;
			const decodedToken = verifyToken(token);

			if (decodedToken && userId) {
				// Kontroll att userId matchar mot användarens userId
				if (decodedToken.userId === userId) {
					const addedItems = [];
					const menuItems = await Menu.find();

					const { total, discountsApplied } = calculateCartTotal(
						items,
						menuItems,
						true
					);

					for (const item of items) {
						const prodId = item.prodId;
						const product = await Menu.findOne({ prodId });

						addedItems.push({
							// ...item,
							prodId: item.prodId,
							qty: item.qty,
							title: product.title,
							price: product.price,
						});
					}

					const order = await Order.create({
						userId,
						items: addedItems,
						total,
						discountsApplied,
					});
					await Cart.deleteOne({ cartId: cartId });
					return res.status(201).json({
						success: true,
						message: "Successfully created order.",
						order: order,
					});
				} else {
					return res.status(403).json({
						success: false,
						message: "Can't create order for another user",
					});
				}

				// Kontroll ifall bara userId finns men att ingen är inloggad
			} else if (userId) {
				return res.status(403).json({
					success: false,
					message: "User must be logged in before order can be made",
				});

				// Kontroll ifall användare är inloggad men cart är för en gäst.
			} else if (decodedToken) {
				return res.status(403).json({
					success: false,
					message: "User can't create order for guest",
				});

				// Kontroll ifall guestId finns
			} else if (guestId) {
				const addedItems = [];
				let total = 0;
				for (const item of items) {
					const prodId = item.prodId;
					const product = await Menu.findOne({ prodId });

					addedItems.push({
						// ...item,
						prodId: item.prodId,
						qty: item.qty,
						title: product.title,
						price: product.price,
					});
					total += product.price * item.qty;
				}
				const order = await Order.create({
					guestId,
					items: addedItems,
					total,
				});

				await Cart.deleteOne({ cartId: cartId });
				return res.status(201).json({
					success: true,
					message: "Successfully created order.",
					order: order,
				});
			} else {
				return res.status(400).json({
					success: false,
					message: "No userId or guestId provided.",
				});
			}
		} else {
			return res.status(400).json({
				success: false,
				message: "Cart must contain an item before placing an order.",
			});
		}
	} else {
		return res.status(400).json({
			success: false,
			message: "cartId doesn't match any cart",
		});
	}
};
