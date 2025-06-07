import Cart from "../models/cart.model.js";
import Menu from "../models/menu.model.js";
import { calculateCartTotal } from "../utils/discount.util.js";

import CustomError from "../utils/customError.util.js";

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
            return next(new CustomError("Cart not found", 404));
        }

        const menuItems = await Menu.find();
        const isLoggedIn = !!global.user;
        const { total, discountsApplied } = calculateCartTotal(
            cart.items,
            menuItems,
            isLoggedIn
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
            cartId: cart.cartId,
            userId: cart.userId,
            guestId: cart.guestId,
            items: itemsWithDetails,
            total,
            discountsApplied,
            isLoggedIn,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/cart - Update Cart
export const updateCart = async (req, res, next) => {
    try {
        const { guestId, prodId, qty } = req.body;
        const userId = global.user ? global.user.userId : null;

        /* if (!prodId || !qty || qty < 0) {
            return next(new CustomError("prodId and valid qty required.", 400));
        }

        if (typeof qty !== "number") {
            return next(new CustomError("Quantity must be a number", 400));
        } */

        const product = await Menu.findOne({ prodId });
        if (!product) {
            return next(new CustomError("Product not found in menu.", 404));
        }

        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
            if (!cart) cart = await Cart.create({ userId, items: [] });
        } else if (guestId) {
            cart = await Cart.findOne({ guestId });
            if (!cart) cart = await Cart.create({ guestId, items: [] });
        } else {
            return next(new CustomError("Missing guestId.", 400));
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.prodId === prodId
        );
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
        const isLoggedIn = !!global.user;
        const { total, discountsApplied } = calculateCartTotal(
            cart.items,
            menuItems,
            isLoggedIn
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
            cartId: cart.cartId,
            userId: cart.userId,
            guestId: cart.guestId,
            items: itemsWithDetails,
            total,
            discountsApplied,
            isLoggedIn,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        });
    } catch (error) {
        next(error);
    }
};
