// Router Import
import { Router } from "express";

// Utils Import
import asyncHandler from "../utils/asyncHandler.util.js";

// Middleware Import
import { validateCartUpdate } from "../middlewares/cart.validator.js";
import { validateBody } from "../middlewares/body.validator.js";

// Middleware Import

// Controllers Import
import {
	getCart,
	getCartById,
	updateCart,
} from "../controllers/cart.controllers.js";

// Config
const router = Router();

// Middleware

// CRUD Routes
router.get("/", asyncHandler(getCart));
router.get("/:id", asyncHandler(getCartById));
router.put("/", validateBody, validateCartUpdate, asyncHandler(updateCart)); // Validation  added before handler

// Export
export default router;
