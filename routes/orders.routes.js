// Router Import
import { Router } from "express";

// Middleware Import
import { validateOrder } from "../middlewares/order.validator.js"; // Added for order validation
import { validateBody } from "../middlewares/body.validator.js";

// Controllers Import
import {
    getAllOrders,
    getOrdersByUserId,
    createOrder,
} from "../controllers/order.controllers.js";

// Config
const router = Router();

// Middleware

// CRUD Routes
router.get("/", getAllOrders);
router.get("/:userId", getOrdersByUserId);
router.post("/", validateBody, validateOrder, createOrder); // Validation middleware added here

// Export
export default router;
