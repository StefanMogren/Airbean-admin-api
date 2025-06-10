import Cart from "../models/cart.model.js";
import Menu from "../models/menu.model.js";
import { calculateCartTotal } from "../utils/discount.util.js";

import CustomError from "../utils/customError.util.js";
import { verifyToken } from "../utils/verifier.util.js";

// GET /api/cart - Return All
export const getCart = async (req, res, next) => {
	try {
		const carts = await Cart.find();
		res.status(200).json({
			success: true,
			carts: carts,
		});
	} catch (error) {
		next(new CustomError("Failed to fetch carts", 500, error));
	}
};

// GET /api/cart/:cartId - Return by ID
export const getCartById = async (req, res, next) => {
	try {
		const { id: cartId } = req.params;
		const cart = await Cart.findOne({ cartId });

		if (!cart) {
			return next(new CustomError("No cart found with cartId", 404));
		}

		const menuItems = await Menu.find();
		const token = req.headers.authorization.replace("Bearer ", "");
		// const token = req.cookies.userToken;
		const decodedToken = verifyToken(token);

		const registeredUser = cart.guestId ? false : true;
		const { total, discountsApplied } = calculateCartTotal(
			cart.items,
			menuItems,
			registeredUser
		);

		const itemsWithDetails = cart.items.map((item) => {
			const product = menuItems.find((m) => m.prodId === item.prodId);
			return {
				prodId: item.prodId,
				qty: item.qty,
				title: product ? product.title : null,
				price: product ? product.price : null,
			};
		});

		res.status(200).json({
			success: true,
			cart: {
				cartId: cart.cartId,
				userId: cart.userId,
				guestId: cart.guestId,
				items: itemsWithDetails,
				total,
				discountsApplied,
				registeredUser,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			},
		});
	} catch (error) {
		next(error);
	}
};

// PUT /api/cart - Update Cart
export const updateCart = async (req, res, next) => {
	try {
		const { guestId, prodId, qty } = req.body;
		const token = req.headers.authorization.replace("Bearer ", "");
		// const token = req.cookies.userToken;

		let registeredUser;

		const product = await Menu.findOne({ prodId });
		if (!product) {
			return next(new CustomError("No item with prodId found.", 400));
		}

		let cart;
		if (token) {
			const decodedToken = verifyToken(token);

			if (decodedToken) {
				registeredUser = true;
				const userId = decodedToken.userId;
				cart = await Cart.findOne({ userId });
				if (!cart) cart = await Cart.create({ userId, items: [] });
			} else {
				return next(new CustomError("Invalid or expired token", 400));
			}
		} else if (guestId) {
			registeredUser = false;
			cart = await Cart.findOne({ guestId });
			if (!cart) cart = await Cart.create({ guestId, items: [] });
		} else {
			return next(new CustomError("Missing guestId.", 400));
		}

		const itemIndex = cart.items.findIndex((item) => item.prodId === prodId);
		if (qty === 0) {
			cart.items = cart.items.filter((item) => item.prodId !== prodId);
		} else {
			if (itemIndex > -1) {
				cart.items[itemIndex].qty = qty;
			} else {
				cart.items.push({ prodId, qty });
			}
		}

		await cart.save();

		const menuItems = await Menu.find();

		const { total, discountsApplied } = calculateCartTotal(
			cart.items,
			menuItems,
			registeredUser
		);

		const itemsWithDetails = cart.items.map((item) => {
			const product = menuItems.find((m) => m.prodId === item.prodId);
			return {
				prodId: item.prodId,
				qty: item.qty,
				title: product ? product.title : null,
				price: product ? product.price : null,
			};
		});

		res.status(200).json({
			success: true,
			cart: {
				cartId: cart.cartId,
				userId: cart.userId,
				guestId: cart.guestId,
				items: itemsWithDetails,
				total,
				discountsApplied,
				registeredUser,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			},
		});
	} catch (error) {
		next(error);
	}
};
